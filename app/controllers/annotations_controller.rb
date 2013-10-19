require 'base64'

class AnnotationsController < ApplicationController

	before_filter :set_canvas_data, only: [:create, :update]
	
	# POST /annotations
	#
	def create
		# TODO Temp code needs cleaning up
		passed_params = annotation_params
		passed_params[:user] = User.first
		passed_params[:video] = Video.first
		@annotation = Annotation.new(passed_params)

		respond_to do |format|
			if @annotation.save
				unless @canvas_data.nil?
					unless @annotation.save_canvas_image(@canvas_data)
						format.json { render json: {error: true, message: "Unable to save the file."} }	
					end
				end
				format.json { render json: @annotation, status: :created, location: @annotation }
			else
				@message = @annotation.errors.empty? ? "Your Annotation has not been saved" : "Your Annotation has not been saved because: " + @annotation.errors.full_messages.to_sentence
				format.json { render json: {error: true, message: @message} }
			end
		end
	end

	# PATCH /annotations/:id
	#
	def update
		@annotation = Annotation.find(params[:id])

		respond_to do |format|
			passed_params = annotation_params
			passed_params[:user] = User.first
			passed_params[:video] = Video.first
			if @annotation.update_attributes(passed_params)
				unless @canvas_data.nil?
					unless @annotation.save_canvas_image(@canvas_data)
						format.json { render json: {error: true, message: "Unable to save the file."} }	
					end
				end
				format.json { render json: @annotation, status: :created, location: @annotation }
			else
				@message = @annotation.errors.empty? ? "Your Annotation has not been saved" : "Your Annotation has not been saved because: " + @annotation.errors.full_messages.to_sentence
				format.json { render json: {error: true, message: @message} }
			end
		end		
	end

	def image_data
		data = Base64.encode64(File.read(params['image_path'])).gsub("\n", '')
		uri  = "data:image/png;base64,#{data}"

		respond_to do |format|
			format.json { render json: {image_data: uri} }
		end
	end

	private
		# Set the strong params
		#
		def annotation_params
			params.require(:annotation).permit(:video, :annotation_type, :start_time, :stop_time, :canvas_data, {position: [:x1, :y1, :height, :width]})
		end

		# Sets the Canvas data if a canvas type
		#
		def set_canvas_data
			if params[:annotation][:annotation_type] == 'canvas'
				@canvas_data = params[:annotation][:canvas_data]
				params[:annotation].delete(:canvas_data)
			else
				@canvas_data = nil
			end
		end

end
