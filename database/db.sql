drop database if exists mrbeast_hasathcharu_meet;
create database mrbeast_hasathcharu_meet;
use mrbeast_hasathcharu_meet;
create table zoom_link(
    link_id char(11) primary key,
    topic varchar(100) not null,
    pwd varchar(200) not null,
    imageUrl varchar(255),
    url varchar(50) default null unique,
    status boolean default 0,
    start_time datetime default null,
    end_time datetime default null,
    access_level tinyint default 0
);
create table user(
    user_id int primary key auto_increment,
    fname varchar(100) not null,
    lname varchar(100) not null,
    password char(128) not null,
    isAdmin boolean default 0,
    email varchar(255) not null unique,
    adminConfirmed boolean default 0,
    firstTime boolean default 1
);

create table assign(
    user_id int,
    link_id char(11),
    primary key(user_id,link_id),
    foreign key (user_id) references user(user_id) on update cascade on delete cascade,
    foreign key (link_id) references zoom_link(link_id) on update cascade on delete cascade
);