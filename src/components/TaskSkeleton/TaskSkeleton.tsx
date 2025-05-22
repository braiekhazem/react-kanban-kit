import { Skeleton } from 'antd'

const TaskSkeleton = () => (
  <div className="task-skeleton">
    <Skeleton
      active
      paragraph={{
        rows: 2,
        width: ['90%', '60%'],
      }}
      title={{
        width: '70%',
      }}
    />
  </div>
)

export default TaskSkeleton
