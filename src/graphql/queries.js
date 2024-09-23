/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserList = /* GraphQL */ `
  query GetUserList($id: ID!) {
    getUserList(id: $id) {
      id
      userId
      userWordsList {
        wordDetail
        imgUrl
        timeStamp
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserLists = /* GraphQL */ `
  query ListUserLists(
    $id: ID
    $filter: ModelUserListFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserLists(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
