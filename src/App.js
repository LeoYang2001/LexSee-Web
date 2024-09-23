import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import MainPage from './pages/MainPage';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

Amplify.configure(config);

function App({ signOut, user }) {
  const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const client = generateClient()
    useEffect(() => {
      const checkUserAndCreate = async () => {
          try {
              // Fetch the current authenticated user
              const user = await getCurrentUser()
              setUserInfo(user)

              //try to fetch user from userList and if the data is null then create an userItem and insert it to the list
              const userFromList = await client.graphql({
                query: queries.getUserList,
                variables: { id: user.userId}
              });

              //user is nonexistent, create and push 
              if(!userFromList?.data?.getUserList)
              {
                console.log('user doest exist yet')
                console.log('creating user...')
                 try {
                  const userItem = {
                    id:user.userId,
                    userId:user.userId,
                    userWordsList: []
                  }

                  await client.graphql({
                    query: mutations.createUserList,
                    variables:{input: userItem}
                  })
                  console.log('user created successfully')
                 } catch (error) {
                  console.log(error)
                 }

                }
                else{
                  console.log('user already exists')
                  console.log(userFromList)
                }

            console.log(user)
          } catch (err) {
              console.log(err)
          } finally {
              setLoading(false);
          }
      };

      checkUserAndCreate();
  }, []);

  return (
    <div style={{height:'100vh', width:'100vw'}} className='flex'>
      <MainPage user={user} signOut={signOut} />
    </div>
  );
}

export default withAuthenticator(App);