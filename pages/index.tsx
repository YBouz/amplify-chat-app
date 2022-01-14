import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack
} from '@chakra-ui/react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API, Auth, graphqlOperation, withSSRContext } from 'aws-amplify';
import { listMessages } from 'src/graphql/queries';
import { useState, useEffect } from 'react';
import { createMessage } from 'src/graphql/mutations';
import Message from '@/components/Message';
import { onCreateMessage } from 'src/graphql/subscriptions';
import { ListMessagesQuery } from 'src/API';

const Home = ({ messages }) => {
  const [user, setUser] = useState(null);
  const [stateMessages, setStateMessages] = useState([...messages]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const amplifyUser = await Auth.currentAuthenticatedUser();
        setUser(amplifyUser);
      } catch (err) {
        setUser(null);
      }
    };

    fetchUser();

    // Subscribe to creation of message
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
      // @ts-ignore
    ).subscribe({
      next: ({ provider, value }) => {
        setStateMessages((stateMessages) => [
          ...stateMessages,
          value.data.onCreateMessage
        ]);
      },
      error: (error) => console.warn(error)
    });
  }, []);

  useEffect(() => {
    async function getMessages() {
      try {
        const messagesReq = (await API.graphql({
          query: listMessages,
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        })) as {
          data: ListMessagesQuery;
          errors: any[];
        };

        setStateMessages([...messagesReq.data.listMessages.items]);
      } catch (error) {
        console.error(error);
      }
    }
    getMessages();
  }, [user]);

  const handleSubmit = async (event) => {
    // Prevent the page from reloading
    event.preventDefault();

    // clear the textbox
    setMessageText('');

    const input = {
      // id is auto populated by AWS Amplify
      message: messageText, // the message content the user submitted (from state)
      owner: user.username // this is the username of the current user
    };

    // Try make the mutation to graphql API
    try {
      await API.graphql({
        authMode: 'AMAZON_COGNITO_USER_POOLS',
        query: createMessage,
        variables: {
          input: input
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (user) {
    return (
      <VStack spacing={8} mt={8}>
        <Heading>Chat App</Heading>

        <VStack
          spacing={4}
          bgColor={'gray.300'}
          minW={'lg'}
          p={8}
          rounded={'md'}
          shadow={'md'}
        >
          {stateMessages
            // sort messages oldest to newest client-side
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((message) => (
              // map each message into the message component with message as props
              <Message
                key={message.id}
                message={message}
                user={user}
                isMe={user.username === message.owner}
              />
            ))}

          <HStack
            as="form"
            justify={'center'}
            minW={'xl'}
            onSubmit={handleSubmit}
          >
            <FormControl isRequired>
              {/* <FormLabel htmlFor="message">Message</FormLabel> */}
              <Input
                variant={'outline'}
                type="text"
                id="message"
                name="message"
                autoFocus
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="💬 Send a message to the world 🌎"
              />
            </FormControl>
            <Button type="submit">Send</Button>
          </HStack>
        </VStack>
      </VStack>
    );
  } else {
    return (
      <VStack spacing={8} mt={8}>
        <Heading>Amplify Test App</Heading>

        <Text>Loading...</Text>
      </VStack>
    );
  }
};

export async function getServerSideProps({ req }) {
  // wrap the request in a withSSRContext to use Amplify functionality serverside.
  const SSR = withSSRContext({ req });

  try {
    // currentAuthenticatedUser() will throw an error if the user is not signed in.
    const user = await SSR.Auth.currentAuthenticatedUser();

    // If we make it passed the above line, that means the user is signed in.
    const response = await SSR.API.graphql({
      query: listMessages,
      // use authMode: AMAZON_COGNITO_USER_POOLS to make a request on the current user's behalf
      authMode: 'AMAZON_COGNITO_USER_POOLS'
    });

    // return all the messages from the dynamoDB
    return {
      props: {
        messages: response.data.listMessages.items
      }
    };
  } catch (error) {
    // We will end up here if there is no user signed in.
    // We'll just return a list of empty messages.
    return {
      props: {
        messages: []
      }
    };
  }
}

export default withAuthenticator(Home);
