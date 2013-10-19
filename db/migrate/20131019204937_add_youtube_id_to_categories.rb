class AddYoutubeIdToCategories < ActiveRecord::Migration
  def self.up
  	add_column :categories, :youtube_id, :integer
  end

  def self.down
  	remove_column :categories, :youtube_id
  end
end
