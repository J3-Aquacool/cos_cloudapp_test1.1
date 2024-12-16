import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import questions from "../questiondatas/questions";
import axios from "axios";

import { useEffect } from "react";

import "./resultpage.css";
import Modal from './ModalBox'; 
const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { responses } = location.state || {};
  const email = location.state?.email || localStorage.getItem("email");
  const username = localStorage.getItem("username");

  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const [groupedQuestions, setGroupedQuestions] = useState(
    questions.reduce((acc, question, index) => {
      const { category } = question;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        questionNumber: question.id,
        score: responses[index],
        additionalScore: 0,
      });
      return acc;
    }, {})
  );
  const [isSummarySubmitted, setIsSummarySubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const categories = Object.keys(groupedQuestions);

  
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      // Redirect if no session exists
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  

 



  const handleSummarySubmit =()=> {
    if (selectedCount < 3) {
      alert("Please select exactly 3 questions before proceeding.");
      return;
    }
    setShowModal(true); // Show modal for confirmation
  };
  const submitData = async () => {
    const resultData = [];
    categories.forEach((category) => {
      groupedQuestions[category].forEach((question) => {
        const { score, additionalScore, questionNumber } = question;
        const grandTotal = score + additionalScore;

        resultData.push({
          email,
          timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
          questionNumber,
          category,
          rating: score,
          additionalMarks: additionalScore,
          grandTotal,
        });
      });
    });

    try {
      await axios.post("/api/submit-responses", resultData, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      navigate("/logout", { replace: true });

      //setShowModal(true);  // Show the modal on success
    } catch (error) {
      alert("Error submitting responses:")
      console.error("Error submitting responses:", error);
    }
  };

  const handleViewResults = async () => {
    setIsLoadingPDF(true); // Start loading
    try {
      const response = await axios.get(`/api/download-pdf?email=${encodeURIComponent(
          email
        )}`,
        { responseType: "blob" }
      );

      const pdfBlob = response.data;
      const pdfUrl = URL.createObjectURL(pdfBlob);

      //lets update the code here to download

      const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "survey-results.pdf"; // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
      //window.open(pdfUrl, "_blank");
       // Navigate to LogoutPage
    navigate("/logout", { replace: true });
    } catch (error) {
      console.error("Error generating PDF:", error);
    }

    finally
    {
      setIsLoadingPDF(false); // End loading
    }
  };

  const handleCheckboxChange = (event, index) => {
    const isChecked = event.target.checked;
    const newSelectedCheckboxes = { ...selectedCheckboxes };

    if (isChecked && selectedCount < 3) {
      newSelectedCheckboxes[index] = true;
      setSelectedCount(selectedCount + 1);
    } else if (!isChecked) {
      newSelectedCheckboxes[index] = false;
      setSelectedCount(selectedCount - 1);
    }

    setSelectedCheckboxes(newSelectedCheckboxes);

    const updatedGroupedQuestions = { ...groupedQuestions };
    questions.forEach((question, qIndex) => {
      const categoryQuestions = updatedGroupedQuestions[question.category];
      const questionInGroup = categoryQuestions.find(
        (q) => q.questionNumber === question.id
      );

      if (questionInGroup) {
        questionInGroup.additionalScore = newSelectedCheckboxes[qIndex]
          ? 4
          : 0;
      }
    });

    setGroupedQuestions(updatedGroupedQuestions);
  };

  return (

    <div className="results-page-wrapper">
    {/* Instructions Box */}
    <div className="instructions-box">
      <h4>Instructions</h4>
      <p>
        At this point, look over your answers and locate all of the answers you rated highest. 
        Pick out the THREE items that seem most true for you and give each of those items an additional FOUR (4) points. 
        You can now score your questionnaire. The scales will have more meaning to you once you have read the text in the next section.
      </p>
    </div>

    <div className="results-page">
      <h4>Career Inventory Scoring Sheet</h4>
      <div className="top-left-content">
      <p>
        Welcome, {username} ({email})!
      </p>
    </div>
    
       
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Score</th>
            <th>Select (Any 3)</th>
          </tr>
        </thead>
        <tbody>
          {questions
            .map((question, index) => ({
              question,
              score: responses[index],
              index,
            }))
            .filter(({ score }) => score >= 4 && score <= 6)
            .sort((a, b) => b.score - a.score)
            .map(({ question, score, index }) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{question.text}</td>
                <td>{score}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCheckboxes[index] || false}
                    onChange={(e) => handleCheckboxChange(e, index)}
                    disabled={!selectedCheckboxes[index] && selectedCount >= 3}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      
      

      <div className="button-container" style={{ display: "flex", gap: "10px" }}>
        <button  className="results-page-button"
          onClick={handleSummarySubmit}
          style={{ marginTop: "20px", padding: "10px 20px" }}
          disabled={isSummarySubmitted}
        >
          {isSummarySubmitted ? "Submission Completed" : "End Submission"}
        </button>
{/* Show modal on submission success */}

{showModal && (
  <Modal
    message="Are you sure you want to submit your responses?"
    onConfirm={() => {
      setShowModal(false);
      submitData();
    }}
    onCancel={() => setShowModal(false)}
  />
)}

{
/*

        
        <button
          onClick={handleViewResults}
          style={{ marginTop: "20px", padding: "10px 20px" }}
          disabled={!isSummarySubmitted || isLoadingPDF}
        >
        {isLoadingPDF ? "Generating PDF..." : "View Results"}
        </button>
*/

}
<button
onClick={handleViewResults}
style={{ marginTop: "20px", padding: "10px 20px" }}
disabled={!isSummarySubmitted || isLoadingPDF}
>
{isLoadingPDF ? "Generating PDF..." : "View Results"}
</button>
      </div>


      
    </div>
    </div>
  );
};

export default ResultsPage;
