
CREATE TABLE IF NOT EXISTS states (
	state_id varchar(255) NOT NULL,
	game_id varchar(11) NOT NULL,
  	player_x int(11) NOT NULL,
  	player_y int(11) NOT NULL,
  	player_carry int(11) NOT NULL,
    agent_x int(11) NOT NULL,
  	agent_y int(11) NOT NULL,
  	agent_carry int(11) NOT NULL,
    red_x int(11) NOT NULL,
  	red_y int(11) NOT NULL,
  	blue_x int(11) NOT NULL,
    blue_y int(11) NOT NULL,
  	green_x int(11) NOT NULL,
  	green_y int(11) NOT NULL,
    PRIMARY KEY (state_id)
);

CREATE TABLE IF NOT EXISTS items (
	id varchar(255) NOT NULL,
    x int(11) NOT NULL,
  	y int(11) NOT NULL,
  	status bool NOT NULL,
    color varchar(255) NOT NULL,
    state_id varchar(255) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fkstate FOREIGN KEY (state_id) 
		REFERENCES states(state_id)
);

