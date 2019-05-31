// Begining of the typescript magic
declare const routes: unique symbol
type Router<AllRoutes = never> = {
  get<T extends string, R>(route: T, handler: (ctx: any) => R): Router<AllRoutes | { name:T, returnType: R }>,
  [routes]: AllRoutes
}
declare function createRouter(): Router

type AllNames<R extends Router<any>> = R[typeof routes]["name"]

// The following type uses the distributivity of the conditional types over the union type
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
// in order to find the route with the correct name in the combined `AllRoutes` type of the router
// In new versions of typescript mapped tuples could be used but that could be more complicated
type Find<Name, AllRoutes> = AllRoutes extends { name: Name } ? AllRoutes : never

type ApiCall<R extends Router<any>> = <N extends AllNames<R>>(name: N) => Find<N, (R)[typeof routes]>["returnType"]

declare function createAPICallFromRouter<R extends Router<any>>(): ApiCall<R>
// End of the typescript magic, now you can use `createRouter` and `createAPICallFromRouter`

// On the server side create the router and export the type of the router
const router = createRouter()
  .get("routeReturningANumber", () => 12)
  .get("routeReturningAString", () => "abcd")

// On the client side create the api call function from the type of the router
const apiCall = createAPICallFromRouter<typeof router>()

let expectNumber = apiCall("routeReturningANumber")
let expectString = apiCall("routeReturningAString")

console.log(expectNumber * 2, expectString.substr(0, 5))