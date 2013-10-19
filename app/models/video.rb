class Video < ActiveRecord::Base

	validates :video_url, :youtube_id, :presence => true

end