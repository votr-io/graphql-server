export type CoreFunction<
  Context extends object,
  Input extends object,
  Output extends object
> = (ctx: Context, input: Input) => Promise<Output>;

export type ContextsOf<
  C extends {
    [K: string]: (ctx: ContextsOf<C>, input: InputsOf<C>) => OutputsOf<C>;
  }
> = Parameters<C[keyof C]>[0];

export type InputsOf<
  C extends {
    [K: string]: (ctx: ContextsOf<C>, input: InputsOf<C>) => OutputsOf<C>;
  }
> = Parameters<C[keyof C]>[1];

export type OutputsOf<
  C extends {
    [K: string]: (ctx: ContextsOf<C>, input: InputsOf<C>) => OutputsOf<C>;
  }
> = ReturnType<C[keyof C]>;

export interface Metadata {
  coreFunctionName: string;
}

export type CommonWrapperFunction = (
  ctx: any,
  input: any,
  next: (ctx: any, input: any) => Promise<any>,
  metadata: Metadata
) => Promise<any>;

export type WrapperFunction<
  C extends {
    [K: string]: (
      ctx: Parameters<C[typeof K]>[0],
      input: Parameters<C[typeof K]>[1]
    ) => OutputsOf<C>;
  }
> = (
  ctx: ContextsOf<C>,
  input: InputsOf<C>,
  next: (ctx: ContextsOf<C>, input: InputsOf<C>) => OutputsOf<C>,
  metadata: Metadata
) => OutputsOf<C>;

export function wrapWith<
  C extends {
    [K: string]: (
      ctx: Parameters<C[typeof K]>[0],
      input: Parameters<C[typeof K]>[1]
    ) => OutputsOf<C>;
  }
>(core: C, ...wrapperFunctions: WrapperFunction<C>[]): C {
  return wrapperFunctions.reverse().reduce((acc, wrapperFunction) => {
    return _wrapWith(acc, wrapperFunction);
  }, core);
}

function _wrapWith<
  C extends {
    [K: string]: (
      ctx: Parameters<C[typeof K]>[0],
      input: Parameters<C[typeof K]>[1]
    ) => OutputsOf<C>;
  }
>(core: C, wrapperFunction: WrapperFunction<C>): C {
  const ret = Object.keys(core).reduce<C>(
    (acc, coreFunctionName) => {
      //@ts-ignore - reduce typings are frustrating
      acc[coreFunctionName] = async (ctx: ContextsOf<C>, input: any) => {
        return wrapperFunction(ctx, input, core[coreFunctionName], { coreFunctionName });
      };
      return acc;
    },
    { ...core }
  );

  return ret;
}

// -- end of lib code, here's how you'd use it --

interface MyContext {
  userId: string;
}

interface ListTodosInput {
  type: 'ListTodosInput';
}
interface ListTodosOutput {
  todos: string[];
}
const listTodos: CoreFunction<MyContext, ListTodosInput, ListTodosOutput> = async (
  ctx,
  input: ListTodosInput
) => {
  return { todos: ['whatever'] };
};

interface CreateTodoInput {
  type: 'CreateTodoInput';
  text: string;
}
interface CreateTodoOutput {
  todo: string;
}
const createTodo: CoreFunction<MyContext, CreateTodoInput, CreateTodoOutput> = async (
  ctx,
  input
) => {
  return { todo: input.text };
};

const core = {
  listTodos,
  createTodo,
};

(async () => {
  console.log('starting');
  const ctx = { userId: 'asdf' };

  await createTodo(ctx, {
    type: 'CreateTodoInput',
    text: 'whatever',
  });

  const test = await core.listTodos(ctx, { type: 'ListTodosInput' });
  const { todos } = test;
})();

const coreWithLogging = wrapWith(core, (ctx, input, next, metadata) => {
  if (metadata.coreFunctionName === '')
    if (input.type === 'CreateTodoInput') {
    }
  console.log('a function is being called!');
  return next(ctx, input);
});

(async () => {
  console.log('starting');
  const test = await coreWithLogging.listTodos(
    { userId: 'asdf' },
    { type: 'ListTodosInput' }
  );
  const { todos } = test;
})();
