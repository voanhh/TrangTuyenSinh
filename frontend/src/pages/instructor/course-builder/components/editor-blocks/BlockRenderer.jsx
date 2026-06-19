import TextBlock from './TextBlock';
import VideoBlock from './VideoBlock';
import ImageBlock from './ImageBlock';
import QuizBlock from './QuizBlock';

const BLOCK_COMPONENTS = {
  text: TextBlock,
  video: VideoBlock,
  image: ImageBlock,
  quiz: QuizBlock,
};

export default function BlockRenderer({ block }) {
  const Component = BLOCK_COMPONENTS[block.type];

  if (!Component) {
    return <div className="p-4 text-red-500 bg-red-50">Loại nội dung không hỗ trợ!</div>;
  }

  return (
    <div className="relative p-4 mb-4 transition-all bg-white border border-blue-100 shadow-sm rounded-xl hover:shadow-md hover:border-orange-300 group">
      {/* Vùng chung cho mọi block: Nút xóa, kéo thả... */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-slate-400 hover:text-orange-500">🗑️</button>
      </div>
      
      {/* Render Component Động */}
      <Component data={block.data} />
    </div>
  );
}