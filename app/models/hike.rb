class Hike < ActiveRecord::Base
	include ActionView::Helpers::UrlHelper
	include ActionView::Helpers::TagHelper
	include ActionView::Helpers
	
	validates_presence_of :name
	validates_presence_of :lat
	validates_presence_of :lng
	
	has_many :photos
	has_many :hearts
	has_many :comments
	belongs_to :user	
	
	after_save :update_user
	default_scope :order => "hiked_at DESC"
	scope :year, lambda { |year| { :conditions => ["hiked_at >= ? AND hiked_at <= ?", Date.civil(year,1,1), Date.civil(year,12,31)]} }
	
	acts_as_mappable
	
	cattr_reader :per_page
  @@per_page = 15
	
	def to_bbcode
		output = ""
		output << "#{mileage} miles, #{elevation}' gained" 
		output << ", #{nights} night(s)" if nights >0
		output << "\n\n#{report}\n\n"
		photos.each do |photo|
			unless photo.id.blank?
				output << "[url=http://wenthiking.com#{photo.image.url(:original)}][img]http://wenthiking.com#{photo.image.url(:large)}[/img][/url]"
				output << "\n#{photo.caption}" unless photo.caption.blank?
				output << "\n\n"
			end
		end
		output
	end
	
	def to_html
		output = ""
		output << "#{mileage} miles, #{elevation}' gained" 
		output << ", #{nights} night(s)" if nights >0
		output << "\n\n#{report}\n\n"
		photos.each do |photo|
			unless photo.id.blank?
				output << link_to("<img src='http://wenthiking.com#{photo.image.url(:bpl)}' />".html_safe, "http://wenthiking.com#{photo.image.url(:original)}")
				output << "\n#{photo.caption}" unless photo.caption.blank?
				output << "\n\n"
			end
		end
		output
	end
	
	def to_param
    "#{id}-#{name.downcase.gsub(/[^[:alnum:]]/, '-')}".gsub(/-{2,}/, "-")
  end
	
	private
	
	def update_user
		user.update_stats
	end
end