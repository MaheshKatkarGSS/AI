from flask import Flask,request
import base64
from flask_accept import accept
from google.cloud import speech
from flask_cors import CORS
from pydub import AudioSegment
import io
import librosa

app =Flask(__name__)
CORS(app,origins=["http://localhost:3000","http://localhost:3000"])

@app.route('/')
def index():
    return "Hello World"


@app.route('/upload',methods=['POST','GET'])
# @accept('multipart/form-data')
def transcript_file():
    blob_file=request.files['blob_file']
    # blob_file = request.files['blob_file']
    if blob_file:
        blob_data = blob_file.read()
        print(type(blob_data),"   ",type(blob_file))
        #to save the file and the nread from file
        # with open("resampled_audio.wav", "wb") as f:
        #     f.write(blob_data)
        # audio=AudioSegment.from_file("resampled_audio.wav")
        # if audio.channels>1:
        #     audio=audio.set_channels(1)
        # if audio.frame_rate != 16000:
        #     audio = audio.set_frame_rate(16000)

        # wav_buffer = io.BytesIO()
        # audio.export(wav_buffer, format="wav")
        # wav_buffer.seek(0)
        # blob_data=wav_buffer.read()
        byte_array = bytearray(blob_data)  # Convert Blob to Bytearray
        byte_message = base64.b64encode(bytes(byte_array)).decode(
            'utf-8')  # Encode bytearray to base64
        #to lower the bitrate of file
        # y,s=librosa.load(byte_message,sr=16000)
        language_code = "en-US"  # a BCP-47 language tag
        RATE = 16000
        WEBM_RATE=48000
        # CHUNK = int(RATE / 10) 
        client=speech.SpeechClient()
        audio=speech.RecognitionAudio(content=byte_message)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=RATE,
            language_code=language_code,
        )
        response = client.recognize(config=config, audio=audio)
        # print(response)
        for res in response.results:
            print(res.alternatives[0].transcript)
            return (res.alternatives[0].transcript)
    return blob_data


@app.route('/upload/byte',methods=['POST'])
def transcript_byte_data():
    req=request.get_json()
    byte_data = req['bytedata']
    if byte_data:
        byte_array = bytearray(byte_data)  # Convert Blob to Bytearray
        print(byte_array)
        byte_message = base64.b64encode(bytes(byte_array)).decode(
            'utf-8')  # Encode bytearray to base64
        language_code = "en-US"  # a BCP-47 language tag
        RATE = 16000
        # CHUNK = int(RATE / 10) 
        client=speech.SpeechClient()
        # audio=speech.RecognitionAudio(content=byte_message)
        # config = speech.RecognitionConfig(
        #     encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        #     sample_rate_hertz=RATE,
        #     language_code=language_code,
        # )
        # response = client.recognize(config=config, audio=audio)
        # for res in response.results:
        #     print(res.alternatives[0].transcript)
    return "uploded"








if __name__=="__main__":
    app.run(debug=True)