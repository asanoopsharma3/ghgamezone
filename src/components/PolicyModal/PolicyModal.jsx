import React from "react";
import "./PolicyModal.scss";
import {
  FaTimes,
  FaShieldAlt,
  FaFileContract,
  FaQuestionCircle,
  FaUndo,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const termsSections = [
  {
    num: "1",
    title: "Eligibility",
    items: [
      "Participation in THE Gameio is open to users who are legally eligible to subscribe and participate under the laws and regulations of their country. By using the service, you confirm that you meet all applicable eligibility requirements.",
    ],
  },
  {
    num: "2",
    title: "Subscription Service",
    intro: "THE Gameio is a subscription-based entertainment and quiz platform.",
    items: [
      "Subscription plans may include Daily, Weekly, or Monthly options (THE Gameio daily: 1 GHS, THE Gameio weekly: 5 GHS, THE Gameio monthly: 18 GHS).",
      "Applicable subscription fees will be charged through your mobile operator or approved payment method.",
      "Subscription renewals may occur automatically until cancelled by the user.",
      "Users may unsubscribe at any time through the available unsubscribe mechanisms.",
    ],
  },
  {
    num: "3",
    title: "Service Description",
    items: [
      "Subscribers gain access to quizzes, challenges, games, leaderboards, rewards programs, and other promotional activities available on THE Gameio.",
    ],
  },
  {
    num: "4",
    title: "Gameplay & Points",
    items: [
      "Users can participate in quizzes and challenges to earn points.",
      "Points are awarded based on successful participation and correct answers.",
      "The number of points awarded for each activity may vary.",
      "THE Gameio reserves the right to modify point allocation mechanisms at any time.",
    ],
  },
  {
    num: "5",
    title: "Leaderboard",
    items: [
      "Users are ranked on leaderboards based on accumulated points.",
      "Leaderboards may be Daily, Weekly, Monthly, or Promotional.",
      "Rankings are updated automatically based on platform activity.",
      "In the event of a tie, THE Gameio may apply additional criteria to determine rankings.",
    ],
  },
  {
    num: "6",
    title: "Rewards & Prizes",
    items: [
      "Eligible users may receive rewards, prizes, airtime, cash prizes, vouchers, devices, or other promotional benefits.",
      "Reward types, quantities, and eligibility requirements may vary by promotion.",
      "Rewards are subject to verification and compliance with these Terms & Conditions.",
      "Rewards are non-transferable and cannot be exchanged unless expressly stated.",
    ],
  },
  {
    num: "7",
    title: "Winner Selection",
    items: [
      "Winners are selected based on leaderboard rankings, accumulated points, promotional mechanics, or random draws where applicable.",
      "All winner selections are final once verified by THE Gameio.",
      "The platform reserves the right to request identity verification before prize distribution.",
    ],
  },
  {
    num: "8",
    title: "Fair Usage Policy",
    intro: "Users must not:",
    items: [
      "Use bots, scripts, or automated tools.",
      "Manipulate scores, rankings, or reward mechanisms.",
      "Create multiple accounts for unfair advantage.",
      "Engage in fraudulent, abusive, or unlawful activities.",
    ],
    outro: "Violations may result in account suspension, disqualification, forfeiture of rewards, or permanent termination of access.",
  },
  {
    num: "9",
    title: "User Responsibilities",
    items: [
      "Users are responsible for ensuring that the mobile number and information provided are accurate and up to date. THE Gameio is not responsible for rewards that cannot be delivered due to incorrect user information.",
    ],
  },
  {
    num: "10",
    title: "Prize Claims",
    items: [
      "Prize claims may require identity verification.",
      "Failure to provide requested information within the specified timeframe may result in forfeiture of the prize.",
      "Fraudulent claims will be rejected.",
    ],
  },
  {
    num: "11",
    title: "Privacy & Data Protection",
    intro: "By using the service, you consent to the collection and processing of your mobile number and related information for:",
    items: [
      "Service delivery",
      "Subscription management",
      "Reward fulfillment",
      "Customer support",
      "Service improvement",
    ],
    outro: "Personal information will be handled in accordance with applicable data protection laws.",
  },
  {
    num: "12",
    title: "Service Availability",
    items: [
      "While we strive to provide uninterrupted access, THE Gameio does not guarantee continuous availability. Service interruptions may occur due to maintenance, network issues, technical failures, or circumstances beyond our control.",
    ],
  },
  {
    num: "13",
    title: "Limitation of Liability",
    items: [
      "THE Gameio, its partners, affiliates, and mobile operators shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of the service.",
    ],
  },
  {
    num: "14",
    title: "Modification of Terms",
    items: [
      "THE Gameio reserves the right to amend these Terms & Conditions at any time. Continued use of the service following such changes constitutes acceptance of the updated Terms.",
    ],
  },
  {
    num: "15",
    title: "Contact Support",
    items: [
      "For assistance, inquiries, subscription support, or prize-related questions, please contact the official THE Gameio customer support channels available on the website.",
    ],
  },
];

const policyContents = {
  "Terms & Conditions": {
    icon: <FaFileContract />,
    title: "TERMS & CONDITIONS",
    date: "© 2026 THE Gameio",
    isCustomTerms: true,
  },
  "Privacy Policy": {
    icon: <FaShieldAlt />,
    title: "PRIVACY POLICY",
    date: "Last Updated: 2026",
    content: [
      "1. Data Collection: By using THE Gameio, you consent to the collection and processing of your mobile number and gaming activity for service delivery, subscription management, reward fulfillment, and customer support.",
      "2. Security & Protection: All personal information and transactions are handled in strict accordance with applicable data protection laws and 256-bit encryption.",
      "3. Fair Play Monitoring: Game play logs and rankings are monitored solely to ensure fair play and prevent unauthorized automation or fraud.",
      "4. User Controls: Users may request access, updates, or removal of their profile information by contacting customer care.",
    ],
  },
  "Refund Policy": {
    icon: <FaUndo />,
    title: "SUBSCRIPTION & REFUND POLICY",
    date: "Last Updated: 2026",
    content: [
      "1. Subscription Plans: Subscriptions are available in Daily (1 GHS), Weekly (5 GHS), and Monthly (18 GHS) tiers.",
      "2. Instant Activation: Passes grant instant access to games, challenges, quizzes, and leaderboard competitions upon confirmation.",
      "3. Cancellations & Auto-Renewals: Users can unsubscribe at any time through standard mobile carrier unsubscribe codes or on-site mechanisms.",
      "4. Support: For billing inquiries or operator charge queries, contact MTN Customer Care by dialing 100 or emailing customercare.GH@mtn.com.",
    ],
  },
  "Help Center": {
    icon: <FaQuestionCircle />,
    title: "MTN SUPPORT & HELP CENTER",
    date: "Available 24/7",
    isSupport: true,
  },
};

const PolicyModal = ({ isOpen, onClose, policyType }) => {
  if (!isOpen) return null;

  const currentPolicy =
    policyContents[policyType] || policyContents["Terms & Conditions"];

  return (
    <div className="policy-modal-overlay" onClick={onClose}>
      <div className="policy-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close policy modal">
          <FaTimes />
        </button>

        <div className="modal-header">
          <div className="icon-badge">{currentPolicy.icon}</div>
          <div className="modal-header-text">
            <h3>{currentPolicy.title}</h3>
            <span className="updated-date">{currentPolicy.date}</span>
          </div>
        </div>

        <div className="policy-body">
          {currentPolicy.isCustomTerms ? (
            <div className="terms-full-container">
              <div className="terms-intro-box">
                <p>
                  Welcome to <strong>THE Gameio</strong>. By accessing or using the service, you agree to be bound by these Terms & Conditions.
                </p>
              </div>

              <div className="terms-sections-list">
                {termsSections.map((sec) => (
                  <div key={sec.num} className="terms-section-card">
                    <h4 className="section-heading">
                      <span className="section-num">{sec.num}.</span> {sec.title}
                    </h4>
                    {sec.intro && <p className="sec-intro">{sec.intro}</p>}
                    {sec.items && (
                      <ul className="sec-list">
                        {sec.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {sec.outro && <p className="sec-outro">{sec.outro}</p>}
                  </div>
                ))}
              </div>

              {/* MTN Support Channels Callout */}
              <div className="mtn-support-callout">
                <h4>MTN Support Contact</h4>
                <div className="support-channels-grid">
                  <a href="tel:100" className="channel-pill">
                    <FaPhoneAlt /> <span>Dial <strong>100</strong></span>
                  </a>
                  <a
                    href="https://wa.me/233554300000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-pill whatsapp"
                  >
                    <FaWhatsapp /> <span>WhatsApp: <strong>0554300000</strong></span>
                  </a>
                  <a href="mailto:customercare.GH@mtn.com" className="channel-pill email">
                    <FaEnvelope /> <span>customercare.GH@mtn.com</span>
                  </a>
                </div>

                <div className="support-social-row">
                  <a
                    href="https://web.facebook.com/MTNGhana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn facebook"
                    aria-label="Facebook"
                  >
                    <FaFacebook /> MTNGhana
                  </a>
                  <a
                    href="https://x.com/MTNGhana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn twitter"
                    aria-label="Twitter"
                  >
                    <FaTwitter /> @MTNGhana
                  </a>
                  <a
                    href="https://www.instagram.com/mtnghana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn instagram"
                    aria-label="Instagram"
                  >
                    <FaInstagram /> @mtnghana
                  </a>
                </div>
              </div>

              <div className="terms-copyright-tag">
                © 2026 THE Gameio. All Rights Reserved.
              </div>
            </div>
          ) : currentPolicy.isSupport ? (
            <div className="support-modal-body">
              <p className="support-lead">
                For assistance, subscription management, inquiries, or prize support, reach out to our official MTN Support channels:
              </p>

              <div className="support-cards-list">
                <a href="tel:100" className="support-contact-item">
                  <div className="item-icon"><FaPhoneAlt /></div>
                  <div className="item-text">
                    <span className="label">MTN Customer Hotline</span>
                    <span className="val">Dial 100</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/233554300000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="support-contact-item whatsapp"
                >
                  <div className="item-icon"><FaWhatsapp /></div>
                  <div className="item-text">
                    <span className="label">Official WhatsApp Support</span>
                    <span className="val">0554300000</span>
                  </div>
                </a>

                <a href="mailto:customercare.GH@mtn.com" className="support-contact-item email">
                  <div className="item-icon"><FaEnvelope /></div>
                  <div className="item-text">
                    <span className="label">Email Support</span>
                    <span className="val">customercare.GH@mtn.com</span>
                  </div>
                </a>
              </div>

              <div className="support-social-section">
                <h5>MTN Ghana Social Channels</h5>
                <div className="social-links-list">
                  <a href="https://web.facebook.com/MTNGhana/" target="_blank" rel="noopener noreferrer">
                    <FaFacebook /> Facebook: MTNGhana
                  </a>
                  <a href="https://x.com/MTNGhana/" target="_blank" rel="noopener noreferrer">
                    <FaTwitter /> Twitter / X: @MTNGhana & @AskMTNGhana
                  </a>
                  <a href="https://www.instagram.com/mtnghana/" target="_blank" rel="noopener noreferrer">
                    <FaInstagram /> Instagram: @mtnghana
                  </a>
                </div>
              </div>

              <div className="terms-copyright-tag">
                © 2026 THE Gameio. All Rights Reserved.
              </div>
            </div>
          ) : (
            <div className="standard-policy-list">
              {currentPolicy.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="understand-btn" onClick={onClose}>
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
