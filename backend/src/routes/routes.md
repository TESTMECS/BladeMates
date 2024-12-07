
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
type Notification = {
  _id: string,
  friendId: string,
  articleId: string,
  read: boolean
}
{
  "notifications": Notification[]
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


## /api/tag-search?tags=tag1,tag2,tag3

### GET - Params
```
tags: comma separated strings. case sensitive

```
#### Response
```typescript
{
  "data": [
    {
      "_id": string,
      "title": string,
      "author": string,
      "publishedAt": string,
      "url": string,
      "imageUrl": string,
      "sourceName": string,
      "tags": string[],
      "description": string
    }
  ]
}
```
