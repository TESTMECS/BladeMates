
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
## /api/global/articles

### GET - no parms  
#### Response
```typescript
{
    _id: string
    title: string
    author: string
    publishedAt: string
}
```

## /api/global/articles/:id

### GET - no parms

#### Response
```typescript
{
      title: string
      author: string 
      publishedAt: string 
      description: string 
      url: string 
      imageUrl: string 
      sourceName: string 
}
```

## /api/comments/:articleId

### GET

#### Response
```typescript
{
  "data": {
    "_id": string,
    "articleId": string,
    "userId": string,
    "username": string,
    "content": string,
    "datePosted": string // iso-format
  }[]
}
```

## /api/comment/:articleId

### POST
```typescript
{
  "content": string,
}
```

#### Response
```typescript
{
  "data": {
    "_id": string,
    "articleId": string,
    "userId": string,
    "username": string,
    "content": string,
    "datePosted": string // iso-format
  }
}
```

### PUT
```typescript
{
  "content": string,
  "commentId": string
}
```

#### Response
```typescript
{
  "data": {
    "_id": string,
    "articleId": string,
    "userId": string,
    "username": string,
    "content": string,
    "datePosted": string // iso-format
  }
}
```

### DELETE
```typescript
{
  "commentId": string
}
```

#### Response
```typescript
{
  "commentId": string
}
```
