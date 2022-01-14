import { Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const Message = ({ message, isMe, user }) => {
  if (user) {
    return (
      <VStack
        bg={isMe ? 'gray.100' : 'gray.200'}
        color={isMe ? 'blue.600' : 'gray.800'}
        spacing={3}
        px={8}
        py={4}
        rounded={'md'}
        shadow={'md'}
        alignSelf={isMe ? 'flex-end' : 'flex-start'}
        alignItems={'flex-start'}
        w="45%"
      >
        <Heading
          as="h3"
          size={'sm'}
          fontWeight={'medium'}
          textTransform={'uppercase'}
        >
          {message.owner}
        </Heading>

        <Text>{message.message}</Text>
      </VStack>
    );
  } else {
    return <Text>Loading...</Text>;
  }
};

export default Message;
