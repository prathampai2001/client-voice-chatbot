

import React, { useEffect, useState ,useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faMicrophone, faStop,faTrash, faCopy, faShare, faFlag} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import chatbot from './chatbot (1).png';
import userlogo from './user (2).png';
import './App.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const ChatBotApp = () => {

  const [conversations, setConversations] = useState([]);
  const[userEmail, setUserEmail]= useState('');
  const chatHistoryRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const [userInput, setUserInput] = useState('');
  const userString = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const copyMessageText = (messageText) => {
    navigator.clipboard.writeText(messageText);
  };

  const shareMessage = (messageText) => {
    navigator.share({ text: messageText });
  };




  const renderMessageActions = (messageText, messageId) => {
    return (
      <div className="message-actions">
        <FontAwesomeIcon className="mess-icon" icon={faCopy} onClick={() => copyMessageText(messageText)} />
        <FontAwesomeIcon className="mess-icon" icon={faShare} onClick={() => shareMessage(messageText)} />
      </div>
    );
  };




  useEffect(() => {
    if (SpeechRecognition.browserSupportsSpeechRecognition()) {
      SpeechRecognition.startListening();
    }
  }, []);

  useEffect(() => {
    if (!listening && transcript !== '') {
      handleInputSubmission(transcript);
      resetTranscript();
    }
  }, [listening, resetTranscript, transcript]);

  const handleInputSubmission = async (input) => {
    console.log('Input:', input);
    try {
      const response = await axios.post('https://chatbot-server-six.vercel.app/Server', {
        userInput: {
          currentUserId: user.userId,
          Query: input
        }
      });

      if (response.status === 200) {
        const { response: serverResponse } = response.data;
        setConversations((prevConversations) => [
          ...prevConversations,
          {
            userId: user.userId,
            query: input,
            response: serverResponse,
            timeStamp: new Date().toISOString()
          }
        ]);
      scrollToBottom();

      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.post('https://chatbot-server-six.vercel.app/chatConvo', {
        userId: user.userId,
        query: ''
      });

      if (response.status === 200) {
        setConversations(response.data.conversations);
        const userEmail = JSON.parse(localStorage.getItem('user')).email;
        setUserEmail(userEmail);
        console.log(response.data.conversations);
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userInput.trim() !== '') {
      handleInputSubmission(userInput);
      setUserInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleDeleteButtonClick = async (index) => {
    const conversationIdToDelete = conversations[index]._id;
    setConversations((prevConversations) =>
      prevConversations.filter((conv) => conv._id !== conversationIdToDelete)
    );

    try {
      const response = await axios.delete('https://chatbot-server-six.vercel.app/deleteConvo', {
        data: { deleteIndex: conversationIdToDelete }
      });

      if (response.status === 200) {
        console.log('Conversationdeleted successfully');
      } else {
        console.error('Failed to delete conversation');
        fetchConversations();
      }
    } catch (error) {
      console.error('Error occurred while deleting the conversation', error);
      fetchConversations();
    }
  };


  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
    }
  }, [conversations]);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      const chatHistoryElement = chatHistoryRef.current;
      const scrollOffset = chatHistoryElement.scrollHeight - chatHistoryElement.clientHeight;
      chatHistoryElement.scrollTop = scrollOffset > 0 ? scrollOffset : 0;
    }
  };

  const handleScroll = () => {
    const chatHistoryElement = chatHistoryRef.current;
    const { scrollTop, scrollHeight, clientHeight } = chatHistoryElement;

    const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 10; // Add a threshold

    shouldScrollRef.current = isScrolledToBottom;
  };

 

  return (
    <div className="chatbot-app">
      <div className="chat-container">
        <div className="header">
        <div className="prof-box">
          <img src={userlogo} alt="chatbot"  />
          <p className="user-email">{userEmail}</p>
          </div>
          <div className="profile">
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
        <div className="chat-history" id="chat-history"   ref={chatHistoryRef} onScroll={handleScroll}>
          {conversations.map((conversation, index) => (
            <div key={index} className={`chat-bubble ${conversation.userId === user.userId ? 'user-bubble' : 'robot-bubble'}`}>
              <div className="message-container">
                <div className="query">
                  {conversation.query}
                  <div className="icons">
                    <FontAwesomeIcon onClick={() => handleDeleteButtonClick(index)} icon={faTrash} className="delete-icon" />
                  
                  </div>
                </div>
                <div className="home-bot-res">
                  <img src={chatbot} alt="chatbot" className="home-bot" />

                  <div className="response">{conversation.response}     
                  {renderMessageActions(conversation.response)}
                  
                  
                   </div>
                </div>
              </div>
            </div>
          ))}
          </div>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="text" placeholder="Type your query" value={userInput} onChange={handleInputChange} />
            <button type="submit" className="send-icon">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
            <FontAwesomeIcon
              onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening}
              icon={listening ? faStop : faMicrophone}
              className="voice-icon"
            />
          </div>
        </form>
      </div>


    </div>
  );
};

export default ChatBotApp;