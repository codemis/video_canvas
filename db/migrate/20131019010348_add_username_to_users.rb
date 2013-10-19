class AddUsernameToUsers < ActiveRecord::Migration
  def self.up
  	add_column :users, :username, :string
  	remove_index(:users, :email)
  end

  def self.down
  	remove_column :users, :username
  end
end
