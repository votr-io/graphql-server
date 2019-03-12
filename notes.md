- As a participant in an election, should I be able to see the full list of registered voters?
  - My feeling is no. If it was somehow just first names, then maybe, but we most likely only have email addresses, and we can't just put those out there.
- As the owner of a private election, should I be able to see who has voted and who hasn't? If so, should that info also be listed on the election page for anyone who has access to see it?
  - My feeling is no. It gives the owner of the election far more visibility than the voters given my feelings on the above question of not displaying email addresses.

* do candidates need ids? probably not, but I'm going to put them in anyway. don't see that hurting anything.

Private election considerations:

- think about what can happen with deregistering people that still posses the registration link? do we care?

API design:

- check in with Erin and make sure all of these wrapped response types aren't going to be too much of a pain in the ass to work against. They way they are now is really optimizing for being able to make non-breaking changes to the API in the future, at the expese of having the data you want to get at in the response being nested down an extra level.

API changes:

- remove setStatus endpint, just have "startElection" and "stopElection" mutations. Statuses will still exist and be the same, the server will just manage them.
- add candidates to updateElection input, whatever is there will clobbber the candidates in the DB
