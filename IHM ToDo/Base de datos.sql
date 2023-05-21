create table tasks(
	id int primary key auto_increment,
    task_name varchar(50) not null,
    task_description varchar(200),
    task_date date not null,
    task_status VARCHAR(20) DEFAULT 'Pendiente'
);

select *
from tasks;