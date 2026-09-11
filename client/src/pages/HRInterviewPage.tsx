import React from 'react';
import TechInterviewPage from './TechInterviewPage';

// For simplicity, reusing the Tech Interview logic but querying for HR category.
// In a full implementation, we might differentiate the UI slightly, but structurally they are identical.
export default function HRInterviewPage() {
  return (
    <TechInterviewPage 
      category="hr-interview"
      title="HR & Behavioral Interview Preparation (Round 2)"
      description="Master behavioral and cultural alignment interview questions using the STAR framework. Study ideal responses reflecting Capgemini's 7 Core Values, conflict resolution, and leadership adaptability."
    />
  );
}
