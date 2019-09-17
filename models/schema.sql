
create table chart
    (ID int auto_increment,
    date varchar(255),
    airfare varchar(255),
    destinationCity varchar(255),
    originCity varchar(255),
    PRIMARY KEY (ID)
    );
    select * from chart;
    INSERT INTO chart (date, airfare, destinationCity, originCity)
VALUES ('2019-10-15', 300, 'Chicago', 'Seattle'),
		('2019-10-14', 300, 'Chicago', 'Seattle'),
        ('2019-10-13', 500, 'Chicago', 'Seattle'),
        ('2019-10-12', 500, 'Chicago', 'Seattle'),
        ('2019-10-11', 300, 'Chicago', 'Seattle'),
        ('2019-10-10', 300, 'Chicago', 'Seattle'),
        ('2019-10-9', 300, 'Chicago', 'Seattle'),
        ('2019-10-8', 300, 'Chicago', 'Seattle'),
        ('2019-10-7', 800, 'Chicago', 'Seattle'),
        ('2019-10-6', 800, 'Chicago', 'Seattle'),
        ('2019-10-5', 300, 'Chicago', 'Seattle'),
        ('2019-10-4', 300, 'Chicago', 'Seattle'),
        ('2019-10-3', 700, 'New York', 'Seattle');
    
select * from chart
where date between '2019-10-10' and '2019-10-15' and
originCity = 'Seattle' and destinationCity = 'Chicago';
