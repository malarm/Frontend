# Query (Context)

```
https://web.minejendom.dk?a=1&b

// gets parsed to:
{
  a: 1,
  b: true
}
```

Context for url query params. On page load, the query/search part of the url is parsed and saved in the context state.

Usage:

```
const {
  query
} = useQueryState();


console.log(query.a) // 1
```
