class VideosController < ApplicationController

	def show
		@video = Video.find(params[:id])	
	end

	def create
		@video = Video.new
		@video.youtube_id = params[:youtube_id]
		@video.private = params[:private]
		@video.title = params[:title]
		@video.description = params[:description]
		@video.video_url = "http://www.youtube.com/embed/#{params[:youtube_id]}"
		respond_to do |format|
			if @video.save
				VideoCategory.match_video_to_category(@video, params[:category])
				format.html { redirect_to video_path(@video) }
			end
		end
	end

	def index
		puts params[:title]
		@videos = Video.search_for_videos(params[:title], params[:category])

		respond_to do |format|
			format.js
		end
	end

end
