/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserList = /* GraphQL */ `
  subscription OnCreateUserList($filter: ModelSubscriptionUserListFilterInput) {
    onCreateUserList(filter: $filter) {
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
export const onUpdateUserList = /* GraphQL */ `
  subscription OnUpdateUserList($filter: ModelSubscriptionUserListFilterInput) {
    onUpdateUserList(filter: $filter) {
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
export const onDeleteUserList = /* GraphQL */ `
  subscription OnDeleteUserList($filter: ModelSubscriptionUserListFilterInput) {
    onDeleteUserList(filter: $filter) {
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
