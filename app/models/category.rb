class Category < ActiveRecord::Base

	has_many :video_categories
	has_many :videos, through: :video_categories

	validates :name, :youtube_id, :presence => true
	validates :name, :youtube_id, :uniqueness => true

end
