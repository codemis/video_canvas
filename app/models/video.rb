class Video < ActiveRecord::Base

	has_many :annotations
	has_many :users, through: :annotations
	
	has_many :video_categories
	has_many :categories, through: :video_categories

	validates :video_url, :youtube_id, :presence => true

end