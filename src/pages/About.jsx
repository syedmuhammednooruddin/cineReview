import React from 'react';
import { Film, Github, Linkedin } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page container">
            <div className="about-hero glass">
                <Film size={64} className="about-icon" />
                <h1 className="about-title">About Cine<span className="text-secondary">Review</span></h1>
                <p className="about-description">
                    The ultimate destination for movie lovers. Discover your next favorite film,
                    share your thoughts, and join a community of cinema enthusiasts.
                </p>
            </div>

            <div className="about-content">
                <div className="mission-section">
                    <h2>Our Mission</h2>
                    <p>
                        We believe that every movie has a story worth telling, not just on the screen, but in the hearts of the audience.
                        CineReview was built to provide a modern, sleek, and intuitive platform for analyzing and discussing cinema
                        in all its forms.
                    </p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card glass">
                        <h3>25+</h3>
                        <p>Movies Listed</p>
                    </div>
                    <div className="stat-card glass">
                        <h3>10k+</h3>
                        <p>Monthly Users</p>
                    </div>
                    <div className="stat-card glass">
                        <h3>50k+</h3>
                        <p>Reviews Written</p>
                    </div>
                </div>

                <div className="contact-section">
                    <h2>Connect With Us</h2>
                    <div className="social-links">
                        <a href="https://github.com/syedmuhammednooruddin" className="social-link" target="_blank" rel="noopener noreferrer"><Github /></a>
                        <a href="https://www.linkedin.com/in/syed-muhammed-nooruddin-87a4873a3" className="social-link" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
