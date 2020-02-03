<?php namespace RallySportED;

/*
 * 2020 Tarpeeksi Hyvae Soft
 * 
 * This script provides functions to call in tandem with exit() to provide the
 * caller with a standard return response in the PHP output stream.
 * 
 * Sample usage:
 * 
 *  - To indicate failure:
 *    exit(Response::code(400)->error_message("Error message"))
 * 
 *  - To indicate success and return a JSON object in the response body:
 *    exit(Response::code(200)->json([object]))
 * 
 *  - To indicate success without a response body:
 *    exit(Response::code(200)->empty_body())
 * 
 *  - To send a web page as HTML source code:
 *    exit(Response::code(200)->html("html source code here"))
 * 
 */

class Response
{
    private $htmlResponseCode;

    // Takes in a standard HTML response code, which will be sent to the client.
    public function __construct(int $htmlResponseCode)
    {
        http_response_code($htmlResponseCode);

        $this->htmlResponseCode = $htmlResponseCode;

        return;
    }

    // A convenience function, so we don't need to do (new Response(xxx))->xxx
    // and can instead have Response::code(xxx)->xxx.
    static public function code(int $htmlResponseCode) : Response
    {
        return (new Response($htmlResponseCode));
    }

    // Writes the response into the PHP output stream.
    private function send_response(string $string, int $cacheForNumSeconds)
    {
        $this->set_cache_header($cacheForNumSeconds);
        
        echo $string;

        return;
    }

    // Indicate to the client for how many seconds it should cache our response.
    private function set_cache_header(int $numSeconds = 0)
    {
        // Note: we don't allow non-successful responses to cache.
        if (($numSeconds <= 0) ||
            (($this->htmlResponseCode < 200) || ($this->htmlResponseCode > 299)))
        {
            header("Cache-Control: no-store");
        }
        else
        {
            header("Cache-Control: max-age={$numSeconds}");
        }

        return;
    }

    // For sending a response that contains no body.
    public function empty_body()
    {
        header("Content-Length: 0");

        return 0;
    }

    public function error_message(string $errorMessage)
    {
        return $this->json(["responseCode"=>$this->htmlResponseCode,
                            "errorMessage"=>$errorMessage,],
                           0);
    }

    public function json(array $jsonObject = [], int $cacheForNumSeconds = 86400)
    {
        $jsonText = json_encode($jsonObject, JSON_UNESCAPED_UNICODE);

        header("Content-Type: application/json; charset=UTF-8");
        header("Content-Length: ".strlen($jsonText));

        $this->send_response($jsonText, $cacheForNumSeconds);

        return 1;
    }

    // Initiates a client download of the given file data with the given file
    // name.
    public function file(string $fileName, string $fileData, int $cacheForNumSeconds = 86400)
    {
        $baseFilename = str_replace("\"", "'", basename($fileName));

        header("Content-Type: application/octet-stream");
        header("Content-Transfer-Encoding: binary"); 
        header("Content-Disposition: attachment; filename=\"{$baseFilename}\"");
        header("Content-Length: ".strlen($fileData));

        $this->send_response($fileData, $cacheForNumSeconds);

        return 0;
    }

    // For sending web pages as HTML source code.
    public function html(string $html, int $cacheForNumSeconds = 0)
    {
        header("Content-Type: text/html; charset=UTF-8");
        header("Content-Length: ".strlen($html));

        $this->send_response($html, $cacheForNumSeconds);

        return 0;
    }
}
