from asyncio import FastChildWatcher
from matplotlib.pyplot import close
from node import Node
import heapq
import time
def return_path(current_node):
        path = []
        current = current_node
        while current is not None:
            path.append(current.position)
            current = current.parent
        return path[::-1]  # Return reversed path


def astar(maze, start, end):
    """
    Returns a list of tuples as a path from the given start to the given end in the given maze
    :param maze:
    :param start:
    :param end:
    :return:
    """

    # Create start and end node
    start_node = Node(None, start)
    start_node.g = start_node.h = start_node.f = 0
    end_node = Node(None, end)
    end_node.g = end_node.h = end_node.f = 0

    # Initialize both open and closed list
    closed_list = [start_node]
    current_node = start_node

    # what squares do we search
    adjacent_squares = ((0, -1), (0, 1), (-1, 0), (1, 0))


    notFinished = True
    # Visited and Deadends Set
    visited = set([])
    deadends = set([])
    
    # Loop until you find the end
    count = 0
    while notFinished:
        count += 1
        if count > 500:
            return return_path(current_node)
        
        if closed_list == []:
            break

        # Generate children
        children = []

        # If we revisit, add nodes to the deadend set
        if current_node.position in visited:
            temp = current_node.parent
            while temp.position != current_node.position:
                deadends.add(temp.position)
                # remove backtracking from path
                temp = temp.parent
            current_node.parent = temp.parent
        else:
            visited.add(current_node.position)
        # end turn if reach destination
        if current_node.position == end_node.position:
                return return_path(current_node)

    
        for new_position in adjacent_squares: # Adjacent squares

            # Get node position
            node_position = (current_node.position[0] + new_position[0], current_node.position[1] + new_position[1])

            # Make sure within range
            if node_position[0] > (len(maze) - 1) or node_position[0] < 0 or node_position[1] > (len(maze[len(maze)-1]) -1) or node_position[1] < 0:
                continue
            
            # Make sure the agent does not go over an object
            if node_position in deadends:
                continue
            
            if maze[node_position[0]][node_position[1]] != 0 and node_position != end_node.position:
                continue
            
            if maze[node_position[0]][node_position[1]+1] != 0 and (node_position[0], node_position[1]+1) != end_node.position:
                continue
                
            if maze[node_position[0]+1][node_position[1]] != 0 and (node_position[0]+1, node_position[1]) != end_node.position:
                continue
                
            if maze[node_position[0]+1][node_position[1]+1] != 0 and (node_position[0]+1, node_position[1]+1) != end_node.position:
                continue
                
            # Create new node
            new_node = Node(current_node, node_position)

            # Append
            children.append(new_node)
        
        # If no possible paths, backtrack
        if children == []:
            current_node = closed_list.pop()
            deadends.add(current_node.position)
            continue

        # Loop through children
        curMin = children[0]
        for child in children:
            # Create the f value
            child.f = ((child.position[0] - end_node.position[0]) ** 2) + ((child.position[1] - end_node.position[1]) ** 2)
            if child < curMin:
                curMin = child
        # choose current minimum and add to list
        current_node = curMin
        closed_list.append(current_node)

    return None