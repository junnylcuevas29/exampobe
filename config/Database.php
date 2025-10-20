<?php
class Database {
  private $host = '127.0.0.1';
  private $db = 'manga_store';
  private $user = 'root';
  private $pass = '';
  public $pdo;
  public function __construct(){
    $dsn = 'mysql:host='.$this->host.';dbname='.$this->db.';charset=utf8mb4';
    $options = [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC];
    $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);
  }
}
