import { useState, useEffect } from "react";
import axios from 'axios';
import { Box } from "@mui/material";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    BasicStorage,
    ChatMessage,
    ChatProvider,
    Conversation,
    ConversationId,
    ConversationRole,
    IStorage,
    MessageContentType,
    Participant,
    Presence,
    TypingUsersList,
    UpdateState,
    User,
    UserStatus
} from "@chatscope/use-chat";
import { useParams } from 'react-router-dom';

import {ExampleChatService} from "@chatscope/use-chat/dist/examples";
import {Chat} from "./components/Chat";
import {nanoid} from "nanoid";
import {AutoDraft} from "@chatscope/use-chat/dist/enums/AutoDraft";



const Chat1 = () => {
    const [users, setUsers] = useState([]);
    const { id } = useParams(); // Get the user ID from the route
    const currentUserIndex = parseInt(id);
    useEffect(() => {
        // Fetch users from the backend
        axios.get('http://localhost:3000/api/users')
            .then(response => {
                // Map the response data to the desired structure
                const mappedUsers = response.data.map(user => ({
                    id: user._id,
                    name: user.firstName,
                    avatar: user.avatar
                }));
    
                // Find the index of the user with the ID matching currentUserIndex
                const currentUserIndexInArray = mappedUsers.findIndex(user => user.id === currentUserIndex);
    
                // If the user is found, move them to the beginning of the array
                if (currentUserIndexInArray !== -1) {
                    const currentUser = mappedUsers.splice(currentUserIndexInArray, 1)[0];
                    mappedUsers.unshift(currentUser);
                }
    
                setUsers(mappedUsers);
                console.log(mappedUsers);
            })
            .catch(error => {
                console.error("An error occurred while fetching user data:", error);
            });
    }, []);
    

    const messageIdGenerator = (message) => nanoid();
    const groupIdGenerator = () => nanoid();

    const storages = users.map(() => new BasicStorage({ groupIdGenerator, messageIdGenerator }));
    const serviceFactory = (storage, updateState) => new ExampleChatService(storage, updateState);

    const chatUsers = users.map((user, index) => new User({
        i: user.id,
        id: user.name,
        presence: new Presence({ status: UserStatus.Available, description: "" }),
        firstName: "",
        lastName: "",
        username: user.name,
        email: "",
        avatar: user.avatar,
        bio: ""
    }));

    const chats = users.map((user, index) => ({
        name: user.name,
        storage: storages[index]
    }));
    

    function createConversation(id, name) {
        return new Conversation({
            id,
            participants: [
                new Participant({
                    id: name,
                    role: new ConversationRole([])
                })
            ],
            unreadCounter: 0,
            typingUsers: new TypingUsersList({items: []}),
            draft: ""
        });
    }
    
    // Add users and conversations to the states
    chats.forEach(c => {
    
        users.forEach(u => {
            if (u.name !== c.name) {
                c.storage.addUser(new User({
                    id: u.name,
                    presence: new Presence({status: UserStatus.Available, description: ""}),
                    firstName: "",
                    lastName: "",
                    username: u.name,
                    email: "",
                    avatar: u.avatar,
                    bio: ""
                }));
    
                const conversationId = nanoid();
    
                const myConversation = c.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === u.name) !== "undefined");
                if (!myConversation) {
    
                    c.storage.addConversation(createConversation(conversationId, u.name));
    
                    const chat = chats.find(chat => chat.name === u.name);
    
                    if (chat) {
    
                        const hisConversation = chat.storage.getState().conversations.find(cv => typeof cv.participants.find(p => p.id === c.name) !== "undefined");
                        if (!hisConversation) {
                            chat.storage.addConversation(createConversation(conversationId, c.name));
                        }
    
                    }
    
                }
    
            }
        });
    
    });
    
    return (
        <Box height="92%">
            {chats.map((chat, index) => (
                <ChatProvider
                    key={index}
                    serviceFactory={serviceFactory}
                    storage={chat.storage}
                    config={{
                        typingThrottleTime: 250,
                        typingDebounceTime: 900,
                        debounceTyping: true,
                        autoDraft: AutoDraft.Save | AutoDraft.Restore
                    }}
                >
                    <Chat user={chatUsers[index]}/>
                </ChatProvider>
            ))}
        </Box>
    );
    
}

export default Chat1;
