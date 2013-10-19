class AddUsernameToUsers < ActiveRecord::Migration
  def self.up
  	add_column :users, :username, :string
  	add_column :users, :avatar_text, :string
  	add_column :users, :guest_user, :boolean, default: false
  	remove_index(:users, :email)
  end

  def self.down
  	remove_column :users, :username
  	remove_column :users, :avatar_text
  	remove_column :users, :guest_user
  end
end
