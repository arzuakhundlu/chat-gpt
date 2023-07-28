import axios from 'axios';
import React, { Component } from 'react'

export class App extends Component {
  state={
    message: '',
    messageBox: [],
    typing: false
  }

  sendMessage(message){
    let text = '';
    let msgBox = this.state.messageBox;
    msgBox.push({
      role: 'user',
      text: message
    });
    this.setState({
      messageBox:msgBox
    })
    for(const msg of msgBox){
      if(msg.role == 'user'){
        text+=`Person: ${msg.text}`
      }else{
        text+=`Assistant: ${msg.text}`
      }
    }

    this.setState({
      message: '',
      typing:true
    })
    const object = {
      "model": "text-davinci-003",
      "prompt": `${text} Assistant: `,
      "temperature":0.9,
      "max_tokens": 150,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0.6,
      "stop": ["Person:", "Assistant:"]
  }

  axios.post('https://api.openai.com/v1/completions', object, {
    headers:{
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    }
    }).then(resp=>{
   
       msgBox.push({
        role: 'asisstant',
        text: resp.data.choices[0].text
      });
      this.setState({
        messageBox:msgBox,
        typing:false
      })
    }).catch(err=>{

    })
      
    
  }
  render() {
    const {message, messageBox, typing} = this.state;
    console.log(messageBox)
    return (
      <section>
        <div className='container'>
          <div className='main_header'>
            <h2>Your ROBO Asisstant</h2>
          </div>
          <div className='chat_body'>
          {typing?  <p className='to_message'>Typing...</p>:null}
            {
              messageBox.reverse().map((msg, i)=>{
                if(msg.role == 'user'){
                  return(
                    <p key={i} className='from_message'>{msg.text}</p>
                  )
                }else{
                  return(
                    <p key={i} className='to_message'>{msg.text}</p>
                  )
                }
              })
            }
           
            
          </div>
          <div className='chat_footer'>
            <input value={message} onChange={(e)=>this.setState({message: e.target.value})} type='text' />
            <button onClick={this.sendMessage.bind(this, message)}>Send</button>
          </div>
        </div>
      </section>
    )
  }
}

export default App