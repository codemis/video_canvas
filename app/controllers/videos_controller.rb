class VideosController < ApplicationController

	def show
			
	end

	def create
		@video = Video.new
		@video.youtube_id = params[:youtube_id]
		@video.private = params[:private]
		@video.video_url = "http://www.youtube.com/embed/#{params[:youtube_id]}"
		respond_to do |format|
			if @video.save
				format.html { redirect_to video_path(@video) }
			end
		end
	end

	def index
		
	end

end
