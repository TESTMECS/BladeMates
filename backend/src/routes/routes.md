
## /api/auth/login

### POST - Body
```typescript
{
  "username": string,
  "password": string
}
```

#### Response
```typescript
{
  "userId": string
}
```

## /api/auth/register

### POST - Body
```typescript
{
  "username": string,
  "password": string
}
```

#### Response
```typescript
{
  "userId": string
}
```




## /api/article/favorite

### POST - Body
```typescript
{
  "articleId": string
}
```

#### Response
```typescript
{
  "data": string[]
}
```

### Delete - Body
```typescript
{
  "articleId": string
}
```

#### Response
```typescript
{
  "data": string[]
}
```



## /api/user/notifications

### POST - Body
```typescript
{}
```

#### Response
```typescript
{
  "notifications": string[]
}
```







## /api/friend/follow

### POST - Body
```typescript
{
  "userId": string
}
```

#### Response
```typescript
'Follow Successful'
```

### /api/friend/unfollow
```typescript
{
  "userId": string
}
```

#### Response
```typescript
'Unfollow Successful'
```
