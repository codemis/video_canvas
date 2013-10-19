class Video < ActiveRecord::Base

	has_many :annotations
	has_many :users, through: :annotations
	
	validates :video_url, :youtube_id, :presence => true

end