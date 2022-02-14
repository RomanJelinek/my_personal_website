import React, {useState, useEffect} from 'react';
import "./Chatbot.css"

const Chatbot = (props) => {
  const answers = [
    {
      message: () => {
        return `I am glad you are here! My name is Roman and I am ${myAge}. Yeah I know what you are thinking. I could have learnt to code when I was younger but hey, I had no idea it is such a fun so better later than never. So now when you know who I am, what is your name?`;
      },
      branch: "hire",
      step: 1,
      buttonText1: "Confirm",
      buttonText2: "fafa",
    },
    {
      message: () => {
        return `Nice to meet you ${userName}! I am going to prepare a CV, please let me know what I should include there.`;
      },
      branch: "hire",
      step: 2,
      buttonText1: "Confirm",
      buttonText2: ""
    },
    {
      message:
        "Alright! The CV is almost ready. Bellow you will find your chosen parts of the CV and also your last interaction. Woud you like to generate CV also for print?",
      branch: "hire",
      step: 3,
      buttonText1: "Yes I would like a print Version",
      buttonText2: "No I don't need a print version",
    },
    {
      message: "Hire step 3",
      branch: "hire",
      step: 4,
      buttonText1: "Otázka1",
      buttonText2: "Otázka2",
    },
  ];

  const checkBoxValues = [
    {id: "openingText", text: "Opening text (not everyone is interested in that I guess)", isChecked: false},
    {id: "education", text: "Education", isChecked: false},
    {id: "onlineMarketing", text: "Previous experience as an online marketing specialist", isChecked: false},
    {id: "react", text: "Projects made in React with description", isChecked: false},
    {id: "hobbies", text: "Hobbies", isChecked: false},
  ]

  const messages = [""];

  const [textToShow, setTextToShow] = useState(
    "Welcome to my website! I am Roman. Let's find out why you are here. You are either just curious random internet user which is totally fine. OR! You are looking for someone to hire as a React developer and then it is totally great!"
  );
  const [buttonText1, setButtonText1] = useState("I am just looking around");
  const [buttonText2, setButtonText2] = useState("Let's set up CV!");
  const [userName, setUserName] = useState("");
  const [nameAlert, setNameAlert] = useState(false)
  const [currentBranch, setCurrentBranch] = useState("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [companyName, setCompanyName] = useState("")
  const [checkBoxes, setCheckBoxes] = useState(checkBoxValues)
  const [myAge, setMyAge] = useState(1)
  const [printVersion, setPrintVersion] = useState(true)


  // Getting a company name from URL (UTM Parameter)
  useEffect(() => {
    const url = window.location.href;
    if (url.includes("=")) {
      const company = url.split("=").pop();
      setCompanyName(company);
    }
  }, []);
  useEffect(() => {
    if (companyName) {
    setTextToShow(`Welcome to my website! Anyone from the ${companyName} company is always welcome here. I am going to try to make my CV as organized as possible. Let's set it up!` )
    }
  },[companyName])
  ///////


  // counting and setting my Age
  useEffect(()=>{
    const today = new Date();
    const birthDate = new Date(1991, 9, 1);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    setMyAge(age)
  }},[])
  ///////

  const handleMessages = (buttonId) => {

    // setting at first Level Branch depending on button Id 
    let setBranch = ""
    if (currentLevel === 1) {
      setBranch = buttonId === "answer1" ? "user" : "hire"
    }
    else {
      setBranch = currentBranch
    }
    //////

    // finding the right object and setting states
      const findMessage = () => {
        const ans = answers.find(
        ({ branch, step }) => setBranch === branch && currentLevel === step
      ) 
        setTextToShow(ans.message);
        setCurrentBranch(setBranch);
        setButtonText1(ans.buttonText1);
        setButtonText2(ans.buttonText2);
        setCurrentLevel(currentLevel + 1)
    }
   ///////

   // checking if the name input was filled
    if (currentLevel === 2 && !userName) {
      setNameAlert(true);
    }
    /////////////
    else {
      setNameAlert(false);


      // last step - transfer data to the local storage and lifting states up
      if (currentLevel === 4) {
        let checkedBoxes = [];
        checkBoxes.map((box) => {   // pulling IDs of checked boxes (CV items)
          box.isChecked && checkedBoxes.push(box.id);
        });

        const dataToSend = {    // preparing variable for local stoage
          userName: userName,
          userType: currentBranch,
          company: companyName,
          itemsToShow: checkedBoxes,
          cvToPrint: buttonId === "answer1" ? true : false
        };

        window.localStorage.setItem("userData", JSON.stringify(dataToSend)); // sending all needed data to local storage 
        props.liftData(false) // updating state in order to close this element 
      }
      //////

      findMessage();
    }
  }


// getting name from form
  const handleName = (e) => {
    setUserName(e.target.value);
  };
/////  


  // handle items for generating CV //
  const handleFormCv = (e) => {
   const id = e.target.id // getting ID of item
   const isChecked = e.target.checked // getting whether the checkbox is checked or not
   const index = checkBoxes.map((x)=>{return x.id}).indexOf(id) // getting index of object in Array
   const arrayCopy = [...checkBoxes] // making a copy of the checkBoxes state
   arrayCopy[index].isChecked = isChecked // updating object 
    setCheckBoxes(arrayCopy)
   }
   ///////
  

  return (
    <div className="chatbot-container">
      <div className="chatbot-text-to-show">{textToShow}
      {currentLevel === 4 && currentBranch === "hire" && checkBoxes.map((item) => {
          if (item.isChecked)
         return <li>{item.text}</li>;
        })}</div>
      {currentLevel === 2 && <>{nameAlert && <div className="chatbox-name-alert">Please fill your name in</div>}<input className="chatbot-input-name" placeholder="Type your name" onChange={handleName}></input></>}
       {currentLevel === 3 && <> {checkBoxes.map((cvItem) => {
          return (
            <li className="chatbot-checkboxes"> <input type="checkbox" onChange={handleFormCv} id={cvItem.id} name={cvItem.id} value={cvItem.id}/><label className="chatbot-checkboxes-label" for={cvItem.id}>{cvItem.text}</label></li>
          )
        })}</>}
      {(!companyName || currentLevel > 1) && (<button onClick={() => {handleMessages("answer1")}}>{buttonText1}</button>)}
      {currentLevel !== 2 && currentLevel !== 3 && (<button onClick={() => {handleMessages("answer2")}}>{buttonText2}</button>)}</div>
      )
      
    
}

export default Chatbot;