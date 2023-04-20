import React from 'react'
/**
 * if AA Many to many BB, AA will not have the ability to change BB,
 *  but only change the join table, so no need to cache change
 *
 */
export default function ManyToManyHandler() {
  return (
    <div>ManyToManyHandler</div>
  )
}

/**
 * Pure Join Table, no additional data
 */
