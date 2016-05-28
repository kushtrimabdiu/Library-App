<?php
	class Book
	{
		public $CONNECTION;
		/**
		**THIS IS THE CONSTRUCTOR
		**/
		public function __construct(){
            $this->CONNECTION = mysqli_connect("localhost","root","qTLw4k+H","rikdb")
                                or die('something went wrong!'.mysqli_connect_error());
        }

        public function getAllBooks()
        {
            $all_books = array();
            $query = "SELECT id,name,author,pages,available,cover FROM books ORDER BY name ASC";
            $result = $this->CONNECTION->query($query);
			while($row = mysqli_fetch_array($result)) {
                array_push($all_books,$row);
            }

            return $all_books;
        }

		public function getAllBooksForAdmin()
        {
            $all_books = array();
            $query = "SELECT l.id AS loan_id,l.picked_up,l.loan_date,b.id,b.name,b.author,b.pages,b.available,b.cover,".
					 "s.name AS user_name,s.surname AS user_surname ".
					 "FROM (((books b) LEFT JOIN loan l ON l.book_id=b.id) LEFT JOIN subscribers s ON l.subscriber_id=s.id) ORDER BY name ASC";
            $result = $this->CONNECTION->query($query);
			while($row = mysqli_fetch_array($result)) {
                array_push($all_books,$row);
            }

            return $all_books;
        }

		public function notifyMeOnBookReturn($book_id)
		{
			$user_id = $this->getIDForUsername();
			$query = "INSERT INTO notification_on_book_free(book_id,subscriber_id) ".
					 "VALUES('".$book_id."','".$user_id."')";

			 if ($this->CONNECTION->query($query) === TRUE) {
				$status ='success';
			 }
			 else {
				$status ='fail';
			 }

	         return $status;
		}

		//funksjoni nodhet edhe te klasa e clients ...
		public function getIDForUsername()
		{
			$query = "SELECT id FROM subscribers WHERE username='".$_SESSION['user']['username']."'";
			$result = $this->CONNECTION->query($query);
			$row_id = mysqli_fetch_array($result);

			return $row_id['id'];
		}

		public function getBookWithID($book_id)
		{
			$book_id = mysqli_real_escape_string($this->CONNECTION, $book_id);
			$query = "SELECT *FROM books WHERE id=".$book_id;
			$result = $this->CONNECTION->query($query);
			$book_row = mysqli_fetch_array($result);
			$book_row['read_count'] = $this->getNumberOfReadsForBookWithID($book_id);
			return $book_row;
		}

		public function getNumberOfReadsForBookWithID($book_id)
		{
			$book_id = mysqli_real_escape_string($this->CONNECTION, $book_id);
			$query = "SELECT COUNT(*) AS count FROM loan WHERE book_id=".$book_id;
			$result = $this->CONNECTION->query($query);
			$book_row = mysqli_fetch_array($result);

			return $book_row['count'];
		}

		public function returnBookWithID($loan_id,$book_id)
		{
			$loan_id = mysqli_real_escape_string($this->CONNECTION, $loan_id);
			$book_id = mysqli_real_escape_string($this->CONNECTION, $book_id);
			$query = "UPDATE loan SET return_date=now(),returned=1 WHERE id=".$loan_id;
			if ($this->CONNECTION->query($query) === TRUE) {
			   //change book status too
			   $query_book = "UPDATE books SET available=1 WHERE id=".$book_id;
			   if ($this->CONNECTION->query($query_book) === TRUE) {
				   	return 'success';
			   }
			}
			return 'fail';
		}

		public function bookPickedUp($loan_id)
		{
			$loan_id = mysqli_real_escape_string($this->CONNECTION, $loan_id);
			$query = "UPDATE loan SET picked_up=1 WHERE id=".$loan_id;
			if ($this->CONNECTION->query($query) === TRUE) {
			   $status ='success';
			}
			else {
			   $status ='fail';
			}

			return $status;
		}

		public function addNewBook($book_array)
		{
			$isbn = mysqli_real_escape_string($this->CONNECTION, $book_array['ibn']);
			$name = mysqli_real_escape_string($this->CONNECTION, $book_array['name']);
			$author = mysqli_real_escape_string($this->CONNECTION, $book_array['author']);
			$pages = mysqli_real_escape_string($this->CONNECTION, $book_array['book_pages']);
			$available = 1;
			$cover = mysqli_real_escape_string($this->CONNECTION, $book_array['cover']);

			$query = "INSERT INTO books(isbn,name,author,pages,available,cover) ".
					 "VALUES('".$isbn."','".$name."','".$author."',".$pages.",'".$available."','".$cover."')";

			if ($this->CONNECTION->query($query) === TRUE) {
 			   $status ='success';
 			}
 			else {
 			   $status ='fail';
 			}

 			return $status;
		}

    }


?>
