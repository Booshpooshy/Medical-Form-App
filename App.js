import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    patientName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    medications: '',
    allergies: '',
    familyHistory: '',
    socialHistory: '',
    reviewOfSystems: '',
    physicalExamination: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: ''
    },
    problemList: '',
    assessment: '',
    plan: '',
    recommendations: '',
    followUp: '',
    doctorName: '',
    doctorSignature: '',
    date: ''
  });

  const formRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const exportToPDF = async () => {
    const element = formRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('medical-form.pdf');
  };

  const clearForm = () => {
    setFormData({
      patientName: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      address: '',
      chiefComplaint: '',
      historyOfPresentIllness: '',
      pastMedicalHistory: '',
      medications: '',
      allergies: '',
      familyHistory: '',
      socialHistory: '',
      reviewOfSystems: '',
      physicalExamination: '',
      vitalSigns: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        respiratoryRate: '',
        oxygenSaturation: ''
      },
      problemList: '',
      assessment: '',
      plan: '',
      recommendations: '',
      followUp: '',
      doctorName: '',
      doctorSignature: '',
      date: ''
    });
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Dr. El Masry - Medical History & Physical Form</h1>
        <div className="button-group">
          <button type="button" onClick={exportToPDF} className="export-btn">
            Export to PDF
          </button>
          <button type="button" onClick={clearForm} className="clear-btn">
            Clear Form
          </button>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="medical-form">
        {/* Page 1 */}
        <div className="form-page">
          <div className="form-header">
            <h2>PATIENT INFORMATION</h2>
          </div>

          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name:</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                />
              </div>
              <div className="form-group full-width">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Full Address"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>CHIEF COMPLAINT</h3>
            <textarea
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              placeholder="Primary reason for visit..."
              rows="3"
            />
          </div>

          <div className="form-section">
            <h3>HISTORY OF PRESENT ILLNESS</h3>
            <textarea
              name="historyOfPresentIllness"
              value={formData.historyOfPresentIllness}
              onChange={handleInputChange}
              placeholder="Detailed description of current symptoms..."
              rows="4"
            />
          </div>

          <div className="form-section">
            <h3>PAST MEDICAL HISTORY</h3>
            <textarea
              name="pastMedicalHistory"
              value={formData.pastMedicalHistory}
              onChange={handleInputChange}
              placeholder="Previous medical conditions, surgeries, hospitalizations..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <h3>MEDICATIONS</h3>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="Current medications..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <h3>ALLERGIES</h3>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="Drug allergies, food allergies..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <h3>FAMILY HISTORY</h3>
              <textarea
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleInputChange}
                placeholder="Family medical history..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <h3>SOCIAL HISTORY</h3>
              <textarea
                name="socialHistory"
                value={formData.socialHistory}
                onChange={handleInputChange}
                placeholder="Smoking, alcohol, occupation..."
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Page 2 */}
        <div className="form-page">
          <div className="form-section">
            <h3>REVIEW OF SYSTEMS</h3>
            <textarea
              name="reviewOfSystems"
              value={formData.reviewOfSystems}
              onChange={handleInputChange}
              placeholder="Systematic review of body systems..."
              rows="4"
            />
          </div>

          <div className="form-section">
            <h3>PHYSICAL EXAMINATION</h3>
            <textarea
              name="physicalExamination"
              value={formData.physicalExamination}
              onChange={handleInputChange}
              placeholder="Detailed physical examination findings..."
              rows="4"
            />
          </div>

          <div className="form-section">
            <h3>VITAL SIGNS</h3>
            <div className="vital-signs-grid">
              <div className="form-group">
                <label>Blood Pressure:</label>
                <input
                  type="text"
                  name="vitalSigns.bloodPressure"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={handleInputChange}
                  placeholder="e.g., 120/80"
                />
              </div>
              <div className="form-group">
                <label>Heart Rate:</label>
                <input
                  type="text"
                  name="vitalSigns.heartRate"
                  value={formData.vitalSigns.heartRate}
                  onChange={handleInputChange}
                  placeholder="bpm"
                />
              </div>
              <div className="form-group">
                <label>Temperature:</label>
                <input
                  type="text"
                  name="vitalSigns.temperature"
                  value={formData.vitalSigns.temperature}
                  onChange={handleInputChange}
                  placeholder="°F"
                />
              </div>
              <div className="form-group">
                <label>Respiratory Rate:</label>
                <input
                  type="text"
                  name="vitalSigns.respiratoryRate"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={handleInputChange}
                  placeholder="breaths/min"
                />
              </div>
              <div className="form-group">
                <label>O2 Saturation:</label>
                <input
                  type="text"
                  name="vitalSigns.oxygenSaturation"
                  value={formData.vitalSigns.oxygenSaturation}
                  onChange={handleInputChange}
                  placeholder="%"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>PROBLEM LIST</h3>
            <textarea
              name="problemList"
              value={formData.problemList}
              onChange={handleInputChange}
              placeholder="List of identified problems..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <h3>ASSESSMENT</h3>
              <textarea
                name="assessment"
                value={formData.assessment}
                onChange={handleInputChange}
                placeholder="Clinical impression and diagnosis..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <h3>PLAN</h3>
              <textarea
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                placeholder="Treatment plan and interventions..."
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>RECOMMENDATIONS</h3>
            <textarea
              name="recommendations"
              value={formData.recommendations}
              onChange={handleInputChange}
              placeholder="Treatment recommendations, lifestyle modifications..."
              rows="3"
            />
          </div>

          <div className="form-section">
            <h3>FOLLOW-UP</h3>
            <textarea
              name="followUp"
              value={formData.followUp}
              onChange={handleInputChange}
              placeholder="Follow-up instructions and appointments..."
              rows="2"
            />
          </div>

          <div className="form-section signature-section">
            <div className="form-row">
              <div className="form-group">
                <label>Doctor Name:</label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  placeholder="Doctor's Name"
                />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Doctor Signature:</label>
              <input
                type="text"
                name="doctorSignature"
                value={formData.doctorSignature}
                onChange={handleInputChange}
                placeholder="Electronic Signature"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;
