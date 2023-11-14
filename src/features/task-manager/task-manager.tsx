// Workspace libraries
import { TopBar } from '@thor-frontend/features/layouts/top-bar'



const TaskManager = () => {

  return <div className="grow flex flex-col h-screen">
    <TopBar title="Opgavestyring" />
    <div className="h-full overflow-auto">
      {/* page content */}
    </div>
  </div>
}

export default TaskManager