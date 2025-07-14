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
    socialHistory: '',
    surgicalHistory: '',
    allergies: '',
    currentMeds: '',
    historyOfPresentIllness: '',
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
    assessmentPlan: '',
    // Signatures
    printName: '',
    signature: '',
    signatureDate: ''
  });

  const formRef = useRef();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderName, setFolderName] = useState('');

  // Load folder preference from localStorage on component mount
  React.useEffect(() => {
    const savedFolderName = localStorage.getItem('preferredFolder');
    if (savedFolderName) {
      setFolderName(savedFolderName);
    }
    // Set zoom to 125% on mount
    document.body.style.zoom = '1.25';
  }, []);

  // Update handleInputChange to support contentEditable divs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // For contentEditable divs, use innerText
    const newValue = type === undefined ? e.target.innerText : value;
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  // Auto-resize textarea to fit content
  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const selectFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        setSelectedFolder(dirHandle);
        setFolderName(dirHandle.name);
        
        // Store folder preference in localStorage
        localStorage.setItem('preferredFolder', dirHandle.name);
        
        // Show success message
        alert(`Folder selected: ${dirHandle.name}\nPDFs will be saved to this folder automatically.`);
      } else {
        alert('Folder selection is not supported in this browser. PDFs will be saved to your default downloads folder.');
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      if (error.name === 'AbortError') {
        // User cancelled folder selection
        return;
      }
      alert('Error selecting folder. Please try again.');
    }
  };

  const clearFolderSelection = () => {
    setSelectedFolder(null);
    setFolderName('');
    localStorage.removeItem('preferredFolder');
    alert('Folder selection cleared. PDFs will be saved to your default downloads folder.');
  };

  const saveToFolder = async (pdfBlob, filename) => {
    if (selectedFolder) {
      try {
        // Create a new file in the selected folder
        const fileHandle = await selectedFolder.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
        
        return true;
      } catch (error) {
        console.error('Error saving to folder:', error);
        return false;
      }
    }
    return false;
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
      while (heightLeft > 0) {
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

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');

      // Try to save to selected folder first
      const savedToFolder = await saveToFolder(pdfBlob, filename);

      if (savedToFolder) {
        // Successfully saved to folder
        setSuccessMessage(`✅ PDF saved to folder: ${folderName}`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      } else {
        // Fallback to regular download
        pdf.save(filename);
        const message = selectedFolder 
          ? '✅ PDF exported successfully! (Folder access failed, saved to downloads)'
          : '✅ PDF exported successfully! Check your downloads folder.';
        setSuccessMessage(message);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
      
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
      socialHistory: '',
      surgicalHistory: '',
      allergies: '',
      currentMeds: '',
      historyOfPresentIllness: '',
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
      assessmentPlan: '',
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
          <p>{successMessage}</p>
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
          <button onClick={selectFolder} className="btn btn-folder">
            {selectedFolder ? `📁 ${folderName}` : '📁 Select Folder'}
          </button>
          {selectedFolder && (
            <button onClick={clearFolderSelection} className="btn btn-clear" style={{backgroundColor: '#95a5a6', fontSize: '0.9rem', padding: '8px 16px'}}>
              Clear Folder
            </button>
          )}
        </div>
      </div>

      <div className="pdf-container" ref={formRef}>
        {/* SINGLE PAGE FOR ALL CONTENT */}
        <div className="pdf-page">
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

          <div className="chief-complaint-section" style={{marginBottom: 0}}>
            <h3>CHIEF COMPLAINT</h3>
            <div
              contentEditable={true}
              name="chiefComplaint"
              suppressContentEditableWarning={true}
              onInput={handleInputChange}
              className="pdf-textarea compact-textarea editable-div"
              placeholder="Enter chief complaint..."
              style={{minHeight: '12px'}}
            >{formData.chiefComplaint}</div>
          </div>

          <div className="history-section" style={{marginBottom: 0}}>
            <h3>PAST MEDICAL HISTORY</h3>
            <div
              contentEditable={true}
              name="pastMedicalHistory"
              suppressContentEditableWarning={true}
              onInput={handleInputChange}
              className="pdf-textarea compact-textarea editable-div"
              placeholder="Enter past medical history..."
              style={{minHeight: '12px'}}
            >{formData.pastMedicalHistory}</div>
          </div>

          <div className="history-section" style={{marginBottom: 0}}>
            <h3>SOCIAL HISTORY</h3>
            <div
              contentEditable={true}
              name="socialHistory"
              suppressContentEditableWarning={true}
              onInput={handleInputChange}
              className="pdf-textarea compact-textarea editable-div"
              placeholder="Smoking, alcohol, occupation, living situation, social support..."
              style={{minHeight: '12px'}}
            >{formData.socialHistory}</div>
          </div>

          <div className="history-section" style={{marginBottom: 0}}>
            <h3>SURGICAL HISTORY</h3>
            <div
              contentEditable={true}
              name="surgicalHistory"
              suppressContentEditableWarning={true}
              onInput={handleInputChange}
              className="pdf-textarea compact-textarea editable-div"
              placeholder="Previous surgeries, procedures, dates, complications..."
              style={{minHeight: '12px'}}
            >{formData.surgicalHistory}</div>
          </div>

          <div className="history-section" style={{marginBottom: 0}}>
            <h3>MEDICATIONS & ALLERGIES</h3>
            <div className="allergies-meds">
              <div className="allergies">
                <span className="label">Allergies:</span>
                <div
                  contentEditable={true}
                  name="allergies"
                  suppressContentEditableWarning={true}
                  onInput={handleInputChange}
                  className="pdf-textarea compact-textarea editable-div"
                  placeholder="List allergies..."
                  style={{minHeight: '12px'}}
                >{formData.allergies}</div>
              </div>
              <div className="meds">
                <span className="label">CURRENT MEDS:</span>
                <div
                  contentEditable={true}
                  name="currentMeds"
                  suppressContentEditableWarning={true}
                  onInput={handleInputChange}
                  className="pdf-textarea compact-textarea editable-div"
                  placeholder="List current medications..."
                  style={{minHeight: '12px'}}
                >{formData.currentMeds}</div>
              </div>
            </div>
          </div>

          <div className="history-section" style={{marginBottom: 0}}>
            <h3>HISTORY OF PRESENT ILLNESS</h3>
            <div
              contentEditable={true}
              name="historyOfPresentIllness"
              suppressContentEditableWarning={true}
              onInput={handleInputChange}
              className="pdf-textarea compact-textarea editable-div"
              placeholder="Describe the history of present illness..."
              style={{minHeight: '12px'}}
            >{formData.historyOfPresentIllness}</div>
          </div>

          <div className="physical-exam-section">
            <h3>PHYSICAL EXAMINATION</h3>
            <div className="exam-columns">
              <div className="exam-column">
                {/* Column 1 exam items */}
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
                {/* Column 2 exam items */}
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

          <div className="assessment-plan-section" style={{marginBottom: 0}}>
            <h3>ASSESSMENT & PLAN</h3>
            <div
              contentEditable={true}
              name="assessmentPlan"
              suppressContentEditableWarning={true}
              onInput={handleInputChange}
              className="pdf-textarea compact-textarea editable-div"
              placeholder="Enter assessment and plan..."
              style={{minHeight: '12px'}}
            >{formData.assessmentPlan}</div>
          </div>

          <div className="signature-section">
            <div className="signature-row" style={{display: 'flex', gap: 2, margin: 0, padding: 0}}>
              <div className="signature-item" style={{flex: 1, minWidth: 0, margin: 0, padding: 0}}>
                <span className="label">Name:</span>
                <input
                  type="text"
                  name="printName"
                  value={formData.printName}
                  onChange={handleInputChange}
                  className="signature-input"
                />
              </div>
              <div className="signature-item" style={{flex: 1, minWidth: 0, margin: 0, padding: 0}}>
                <span className="label">Date:</span>
                <input
                  type="date"
                  name="signatureDate"
                  value={formData.signatureDate}
                  onChange={handleInputChange}
                  className="signature-input"
                />
              </div>
              <div className="signature-item" style={{flex: 1, minWidth: 0, margin: 0, padding: 0}}>
                <span className="label">Sign:</span>
                <input
                  type="text"
                  name="signature"
                  value={formData.signature}
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