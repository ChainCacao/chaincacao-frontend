//cette page est pour les utilisateurs qui ne sont pas des ministères ou des administrateurs, elle va lister tous les acteurs et rediriger vers leur page de login respectif apres que la langue a ete choisie

import React from 'react';
import { Link } from 'react-router-dom';
const LandingPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>   