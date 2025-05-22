import React, { useRef } from 'react'
import TaskCard from '../TaskCard'
import TaskSkeleton from '../TaskSkeleton'
import { CardShadow } from '../TaskCard/TaskCard'

const ItemRow = React.memo(({ data, index, style }: any) => {
  const {
    tasks,
    isLoading,
    renderCard,
    columnId,
    renderTaskAdder,
    renderFooterTasksList,
    isFooter,
    cardOver,
    isShadowCard,
  } = data
  const item = tasks[index]
  const taskRef = useRef<HTMLDivElement>(null)
  const parentItem = item?.isSubtask ? tasks[index - 1] : null

  if ((item?.isLoading || isLoading(index)) && !isFooter(index) && !isShadowCard(index))
    return (
      <div style={{ ...style, paddingLeft: item?.depth * 20 }}>
        <TaskSkeleton />
      </div>
    )

  if ((!item || !item?.id) && !isFooter(index) && !isShadowCard(index)) return null

  return (
    <div style={{ ...style, height: 'fit-content' }} ref={taskRef} className="board-item-row">
      {item?.type === 'task-adder' ? (
        <div className="board-item-row-adder" style={{ paddingLeft: item?.depth * 20 }}>
          {renderTaskAdder(parentItem)}
        </div>
      ) : isFooter(index) ? (
        renderFooterTasksList()
      ) : isShadowCard(index) ? (
        <CardShadow height={cardOver.height} />
      ) : (
        <TaskCard
          task={item}
          setSize={() => {}}
          index={index}
          renderCard={renderCard}
          columnId={columnId}
          isSubtask={item?.isSubtask}
          depth={item?.depth}
        />
      )}
    </div>
  )
})

export default ItemRow
