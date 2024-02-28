import React from 'react'

type Props = {
  children: any
}

export const Page: React.FC<Props> = ({ children }) => {
    return (
      <div className="page">
        { children }
      </div>
    )
}
