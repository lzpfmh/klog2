# GA API Client
require 'google/api_client'

class GaClient

  # 每天访问量
  class DailyVisit
    extend Legato::Model

    metrics :visits
    dimensions :date
  end

  # 年访问量
  class YearlyVisit
    extend Legato::Model

    metrics :visits
    dimensions :year
  end

  # 访问最多的页面
  class TopPage
    extend Legato::Model

    metrics :pageviews
    dimensions :page_path
  end

  # 获取 GA 权限
  def self.service_account_user(scope="https://www.googleapis.com/auth/analytics.readonly")
    if @service_account_user.nil?
      client = ::Google::APIClient.new(
          :application_name => "SOME_STRING",
          :application_version => "SOME_NUMBER"
      )
      ga = Ga.find
      key = Google::APIClient::PKCS12.load_key(ga.secret_file.file.path, "notasecret")
      service_account = Google::APIClient::JWTAsserter.new(ga.api_email, scope, key)
      client.authorization = service_account.authorize
      oauth_client = OAuth2::Client.new("", "", {
          :authorize_url => 'https://accounts.google.com/o/oauth2/auth',
          :token_url => 'https://accounts.google.com/o/oauth2/token'
      })
      token = OAuth2::AccessToken.new(oauth_client, client.authorization.access_token)
      @service_account_user = Legato::User.new(token)
    end

    @service_account_user
  end

  def self.get_total_visits
    results = YearlyVisit.results(service_account_user.profiles.first, :start_date => 5.years.ago, :end_date => 1.day.ago)
    results.map(&:visits).map(&:to_i).reduce(&:+)
  end

  def self.get_daily_visits
    results = DailyVisit.results(service_account_user.profiles.first, :start_date => 1.month.ago, :end_date => 1.day.ago)
    results
  end

  def self.get_top_pages
    results = TopPage.results(service_account_user.profiles.first, :start_date => 1.months.ago, :end_date => 1.day.ago, :sort => "-pageviews", :limit => 10)
    results
  end
end