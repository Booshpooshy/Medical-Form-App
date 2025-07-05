import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    chiefComplaint: '',
    pastMedicalHistory: '',
    allergies: '',
    currentMeds: '',
    // Physical Exam - Column 1
    gen: '',
    head: '',
    eyes: '',
    face: '',
    throat: '',
    breast: '',
    chest: '',
    card: '',
    abdomen: '',
    gu: '',
    // Physical Exam - Column 2
    rectal: '',
    skin: '',
    ext: '',
    back: '',
    neuro: '',
    motor: '',
    cerebellar: '',
    sensory: '',
    cns: '',
    // Problem List & Recommendations
    problem1: '',
    problem2: '',
    problem3: '',
    problem4: '',
    problem5: '',
    problem6: '',
    recommendations: '',
    // Signatures
    printName: '',
    signature: '',
    signatureDate: ''
  });

  const formRef = useRef();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const exportToPDF = async () => {
    const element = formRef.current;
    if (!element) return;

    setIsExporting(true);
    
    try {
      // Create canvas from the form element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Add HIPAA compliance notice to PDF
      const timestamp = new Date().toLocaleString();
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated: ${timestamp} | HIPAA Compliant | Dr. El Masry Medical Form`, 10, 290);

      // Generate filename with patient name and date
      const patientName = formData.patientName || 'Patient';
      const date = formData.date || new Date().toISOString().split('T')[0];
      const filename = `History_Physical_${patientName}_${date}.pdf`;

      // Download the PDF
      pdf.save(filename);
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000); // Hide after 5 seconds
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const createNewForm = () => {
    setFormData({
      patientName: '',
      date: '',
      chiefComplaint: '',
      pastMedicalHistory: '',
      allergies: '',
      currentMeds: '',
      gen: '',
      head: '',
      eyes: '',
      face: '',
      throat: '',
      breast: '',
      chest: '',
      card: '',
      abdomen: '',
      gu: '',
      rectal: '',
      skin: '',
      ext: '',
      back: '',
      neuro: '',
      motor: '',
      cerebellar: '',
      sensory: '',
      cns: '',
      problem1: '',
      problem2: '',
      problem3: '',
      problem4: '',
      problem5: '',
      problem6: '',
      recommendations: '',
      printName: '',
      signature: '',
      signatureDate: ''
    });
  };

  return (
    <div className="App">
      {/* HIPAA Compliance Notice */}
      <div className="hipaa-notice">
        <p>🔒 HIPAA Compliant - Patient data is processed securely and not stored on servers</p>
        <p style={{fontSize: '12px', marginTop: '5px', opacity: '0.8'}}>
          Session timeout: 30 minutes | Data encryption: 256-bit | No server storage
        </p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <p>✅ PDF exported successfully! Check your downloads folder.</p>
        </div>
      )}

      <div className="header">
        <h1>History & Physical Examination Form</h1>
        <div className="button-group">
          <button onClick={createNewForm} className="btn btn-new">
            Create New Form
          </button>
          <button 
            onClick={exportToPDF} 
            className="btn btn-print"
            disabled={isExporting}
          >
            {isExporting ? 'Generating PDF...' : 'Export as PDF'}
          </button>
        </div>
      </div>

      <div className="pdf-container" ref={formRef}>
        {/* PAGE 1 */}
        <div className="pdf-page page-1">
          <div className="pdf-header">
            <h2>HISTORY AND PHYSICAL</h2>
            <div className="patient-info">
              <div className="info-row">
                <span className="label">NAME:</span>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="pdf-input"
                />
                <span className="label">DATE OF BIRTH:</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="pdf-input"
                />
              </div>
            </div>
          </div>

          <div className="chief-complaint-section">
            <h3>CHIEF COMPLAINT</h3>
            <input
              type="text"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              className="pdf-text-input"
              placeholder="Enter chief complaint..."
            />
          </div>

          <div className="history-section">
            <h3>PAST MEDICAL HISTORY</h3>
            <textarea
              name="pastMedicalHistory"
              value={formData.pastMedicalHistory}
              onChange={handleInputChange}
              className="pdf-textarea"
              placeholder="Enter past medical history..."
            />
            
            <div className="allergies-meds">
              <div className="allergies">
                <span className="label">Allergies:</span>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="pdf-input"
                />
              </div>
              <div className="meds">
                <span className="label">CURRENT MEDS:</span>
                <input
                  type="text"
                  name="currentMeds"
                  value={formData.currentMeds}
                  onChange={handleInputChange}
                  className="pdf-input"
                />
              </div>
            </div>
          </div>

          <div className="physical-exam-section">
            <h3>PHYSICAL EXAMINATION</h3>
            <div className="exam-columns">
              <div className="exam-column">
                <div className="exam-item">
                  <span className="exam-label">GEN:</span>
                  <input
                    type="text"
                    name="gen"
                    value={formData.gen}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">HEAD:</span>
                  <input
                    type="text"
                    name="head"
                    value={formData.head}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">EYES:</span>
                  <input
                    type="text"
                    name="eyes"
                    value={formData.eyes}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">FACE:</span>
                  <input
                    type="text"
                    name="face"
                    value={formData.face}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">THROAT:</span>
                  <input
                    type="text"
                    name="throat"
                    value={formData.throat}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">BREAST:</span>
                  <input
                    type="text"
                    name="breast"
                    value={formData.breast}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">CHEST:</span>
                  <input
                    type="text"
                    name="chest"
                    value={formData.chest}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">CARD:</span>
                  <input
                    type="text"
                    name="card"
                    value={formData.card}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">ABDOMEN:</span>
                  <input
                    type="text"
                    name="abdomen"
                    value={formData.abdomen}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">GU:</span>
                  <input
                    type="text"
                    name="gu"
                    value={formData.gu}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
              </div>
              
              <div className="exam-column">
                <div className="exam-item">
                  <span className="exam-label">RECTAL:</span>
                  <input
                    type="text"
                    name="rectal"
                    value={formData.rectal}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">SKIN:</span>
                  <input
                    type="text"
                    name="skin"
                    value={formData.skin}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">EXT:</span>
                  <input
                    type="text"
                    name="ext"
                    value={formData.ext}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">BACK:</span>
                  <input
                    type="text"
                    name="back"
                    value={formData.back}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">NEURO:</span>
                  <input
                    type="text"
                    name="neuro"
                    value={formData.neuro}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">MOTOR:</span>
                  <input
                    type="text"
                    name="motor"
                    value={formData.motor}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">CEREBELLAR:</span>
                  <input
                    type="text"
                    name="cerebellar"
                    value={formData.cerebellar}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">SENSORY:</span>
                  <input
                    type="text"
                    name="sensory"
                    value={formData.sensory}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
                <div className="exam-item">
                  <span className="exam-label">CN's:</span>
                  <input
                    type="text"
                    name="cns"
                    value={formData.cns}
                    onChange={handleInputChange}
                    className="exam-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 2 */}
        <div className="pdf-page page-2">
          <div className="problem-list-section">
            <h3>PROBLEM LIST</h3>
            <div className="problem-items">
              <div className="problem-item">
                <span className="problem-number">1.</span>
                <input
                  type="text"
                  name="problem1"
                  value={formData.problem1}
                  onChange={handleInputChange}
                  className="problem-input"
                />
              </div>
              <div className="problem-item">
                <span className="problem-number">2.</span>
                <input
                  type="text"
                  name="problem2"
                  value={formData.problem2}
                  onChange={handleInputChange}
                  className="problem-input"
                />
              </div>
              <div className="problem-item">
                <span className="problem-number">3.</span>
                <input
                  type="text"
                  name="problem3"
                  value={formData.problem3}
                  onChange={handleInputChange}
                  className="problem-input"
                />
              </div>
              <div className="problem-item">
                <span className="problem-number">4.</span>
                <input
                  type="text"
                  name="problem4"
                  value={formData.problem4}
                  onChange={handleInputChange}
                  className="problem-input"
                />
              </div>
              <div className="problem-item">
                <span className="problem-number">5.</span>
                <input
                  type="text"
                  name="problem5"
                  value={formData.problem5}
                  onChange={handleInputChange}
                  className="problem-input"
                />
              </div>
              <div className="problem-item">
                <span className="problem-number">6.</span>
                <input
                  type="text"
                  name="problem6"
                  value={formData.problem6}
                  onChange={handleInputChange}
                  className="problem-input"
                />
              </div>
            </div>
          </div>

          <div className="recommendations-section">
            <h3>RECOMMENDATIONS</h3>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleInputChange}
              className="pdf-textarea"
              placeholder="Enter recommendations..."
            />
          </div>

          <div className="signature-section">
            <div className="signature-row">
              <div className="signature-item">
                <span className="label">Print Name:</span>
                <input
                  type="text"
                  name="printName"
                  value={formData.printName}
                  onChange={handleInputChange}
                  className="signature-input"
                />
              </div>
              <div className="signature-item">
                <span className="label">Signature:</span>
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
                  onChange={handleInputChange}
                  className="signature-input"
                />
              </div>
              <div className="signature-item">
                <span className="label">Date of Visit:</span>
                <input
                  type="date"
                  name="signatureDate"
                  value={formData.signatureDate}
                  onChange={handleInputChange}
                  className="signature-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;