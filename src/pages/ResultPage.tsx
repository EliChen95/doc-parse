import { Tabs } from 'antd';
import DocumentContent from '../components/DocumentContent';
import Summary from '../components/Summary';
import MindMap from '../components/MindMap';

const { TabPane } = Tabs;

const ResultPage: React.FC = () => {
  return (
    <div className="flex p-4 h-full">
      <div className="w-1/2 pr-4 h-full overflow-y-auto">
        <DocumentContent />
      </div>
      <div className="w-1/2 h-full overflow-y-auto">
        <Tabs defaultActiveKey="1" className='h-full'>
          <TabPane tab="摘要" key="1">
            <Summary />
          </TabPane>
          <TabPane tab="脑图" key="2">
            <MindMap />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ResultPage;