import React from 'react';
import Layout from '../src/components/RadioShow/Layout';
import { islandLifeShow } from '../src/data/showData';

const RadioShowDemo: React.FC = () => {
  return <Layout showInfo={islandLifeShow} />;
};

export default RadioShowDemo;