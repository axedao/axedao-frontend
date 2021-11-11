import Header from 'src/views/Landing/components/Header';
import JoinCommunitySection from "src/views/Landing/components/JoinCommunitySection" 
import ClaimSection from "./components/ClaimSection" 

export default function IDO() {
  
  return (
    <div className="landing-page">
      <Header />
      <ClaimSection/>
      <JoinCommunitySection/>
    </div>
  );
}