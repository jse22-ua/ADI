create table users(
    id integer primary key,
    email text,
    password text,
    nickname text,
    admid boolean default 0
);

create table comics(
    id integer primary key,
    name text,
    autor text,
    description text,
    category text,
    price decimal(10,2),
    stock integer
);

create table orders(
    id integer primary key,
    id_user integer,
    id_comic integer,
    price decimal(10,2),
    fecha date,
    quantity integer,
    totalprice decimal(10,2),
    foreign key(id_user) references users(id),
    foreign key(id_comic) references comics(id)
);
